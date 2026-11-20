import curves from "./modelCurves.json";

/* What sits behind each model card. Figures are the recorded results of the
   real training and evaluation runs; nothing here is source code. */

export type Row = { label: string; value: string };

export type ModelChart = {
  title: string;
  /** what one step on the x axis is */
  unit: string;
  points: number[];
  /** an epoch worth pointing at, 1-based */
  mark?: { index: number; label: string };
};

export type ModelTable = {
  title: string;
  columns: string[];
  rows: string[][];
  note?: string;
};

export type ModelHeatmap = {
  title: string;
  rows: string[];
  columns: string[];
  values: number[][];
  digits: number;
  suffix?: string;
  /** shade each row against its own range */
  scale?: "row";
  /** narrower cells, for many columns */
  compact?: boolean;
  note?: string;
};

export type ModelDetail = {
  role: string;
  /** folder under public/examples with one real run of the model */
  example?: string;
  stats: Row[];
  config?: { title: string; rows: Row[] }[];
  chart?: ModelChart;
  table?: ModelTable;
  heatmap?: ModelHeatmap;
  /** a drawn explanation; never real drawing data */
  illustration?: "char-maps";
  /** a panel that measures something in the visitor's browser */
  live?: "vitals";
  notes: string[];
};

export const modelDetails: Record<string, ModelDetail> = {
  "DBNet++ text detection": {
    example: "dbnetpp",
    role: "The main text detector of the drawing pipeline. Every page is cut into overlapping tiles, each tile is searched for text, and the boxes are merged back into page coordinates. A small DBNet student, trained on the big model's own output, does the same job inside the infoblock at a fraction of the cost.",
    stats: [
      { label: "Text instances in the training set", value: "537,995" },
      { label: "Training images", value: "11,689" },
      { label: "Median text height", value: "27.7 px" },
      { label: "Tile size · stride", value: "1600 px · 800 px" },
      { label: "Infoblock crops (student)", value: "5,257" },
      {
        label: "Tile-merge parity with the old output",
        value: "88–100 % of boxes",
      },
    ],
    config: [
      {
        title: "Page detector",
        rows: [
          {
            label: "Architecture",
            value: "DBNet++ · ResNet-50 (oCLIP) · FPNC",
          },
          { label: "Framework", value: "MMOCR on PyTorch 2.0" },
          { label: "Training", value: "8 GPUs, distributed" },
          { label: "Serving", value: "OpenVINO on CPU Lambda" },
        ],
      },
      {
        title: "Infoblock student",
        rows: [
          {
            label: "Architecture",
            value: "DBNet · MobileNetV3-large ×0.5 · DBFPN 96",
          },
          {
            label: "Input",
            value: "1920 × 1344, whole infoblock, resize + pad",
          },
          { label: "Epochs", value: "300" },
          {
            label: "Optimiser",
            value: "Adam · cosine LR 2e-4 · 4 warm-up epochs",
          },
          { label: "Loss", value: "DB loss · Dice · OHEM 3:1" },
          {
            label: "Post-process",
            value: "threshold 0.3 · box 0.6 · unclip 1.5",
          },
        ],
      },
    ],
    heatmap: {
      title: "How many tiles see each part of a 4800 × 3200 px page",
      rows: ["0–800 px", "800–1600 px", "1600–2400 px", "2400–3200 px"],
      columns: [
        "0–800",
        "800–1600",
        "1600–2400",
        "2400–3200",
        "3200–4000",
        "4000–4800",
      ],
      values: [
        [1, 2, 2, 2, 2, 1],
        [2, 4, 4, 4, 4, 2],
        [2, 4, 4, 4, 4, 2],
        [1, 2, 2, 2, 2, 1],
      ],
      digits: 0,
      compact: true,
      note: "With 1600 px tiles on an 800 px stride, the interior of a page is seen four times. The merge uses that as a vote: a box only one tile reports, where two or more could have, is dropped below 0.70 confidence.",
    },
    notes: [
      "Removed the usual random 640 px crop for the infoblock model. It cut through full-height vertical text, so the model never learned it; the whole block is now resized and padded instead.",
      "Tile merging was rewritten and checked against the previous output on 13 production pages before it replaced it.",
      "Gradient clipping plus a NaN guard in the training loop, after an early run diverged.",
    ],
  },

  "DBNet character detection": {
    example: "dbnet-char",
    role: "Finds each individual character inside a text crop as a heatmap blob. The pipeline uses those blobs to work out which way a piece of text is rotated, and as the mask when text has to be removed without touching the drawing lines around it.",
    stats: [
      { label: "Input", value: "128 × 128 crop" },
      { label: "Exact character count (held-out)", value: "73.0 %" },
      { label: "Merged characters", value: "9.8 %" },
      { label: "Split characters", value: "2.8 %" },
      { label: "Held-out crops", value: "1,625 from 45 drawings" },
    ],
    config: [
      {
        title: "Training",
        rows: [
          {
            label: "Architecture",
            value: "ResNet-50 · FPN · 1-channel heatmap head",
          },
          { label: "Batch · epochs", value: "32 · 100" },
          { label: "Optimiser", value: "Adam · LR 1e-3" },
          { label: "Serving", value: "OpenVINO IR" },
        ],
      },
    ],
    illustration: "char-maps",
    notes: [
      "Its weakness is merging neighbouring characters into one blob. Measuring that properly is what led to the CRAFT replacement.",
      "The original training set was never version-tracked and was lost in a cleanup. Every dataset since goes through DVC and the Data Registry.",
      "Kept in the pipeline as the rollback option behind a switch.",
    ],
  },

  CRAFT: {
    example: "craft",
    role: "The current character detector. It predicts a Gaussian bump at the centre of every character, which keeps touching characters apart where a region heatmap fuses them. It replaced the DBNet character detector after a head-to-head on the same held-out crops.",
    stats: [
      { label: "Parameters", value: "1.43 M" },
      { label: "Input", value: "192 px, letterboxed" },
      { label: "Train · val · test crops", value: "68,666 · 1,619 · 1,625" },
      { label: "Exact character count", value: "98.9 %" },
      { label: "Merged · split characters", value: "0.1 % · 0.1 %" },
    ],
    config: [
      {
        title: "Training and decode",
        rows: [
          {
            label: "Architecture",
            value: "MobileNetV3-small · U-Net decoder · stride 2",
          },
          { label: "Target", value: "Gaussian centre map, σ 0.40" },
          { label: "Decode thresholds", value: "low 0.40 · peak 0.70" },
          { label: "Hardware", value: "single GPU" },
          { label: "Serving", value: "OpenVINO, fixed 1×3×192×192" },
        ],
      },
    ],
    table: {
      title: "Same 1,625 held-out crops",
      columns: ["Metric", "DBNet char", "CRAFT"],
      rows: [
        ["Exact character count", "73.0 %", "98.9 %"],
        ["Merged characters", "9.8 %", "0.1 %"],
        ["Split characters", "2.8 %", "0.1 %"],
      ],
    },
    illustration: "char-maps",
    notes: [
      "Scored on exact character count and merge rate, never mAP: a box that is slightly off costs nothing, a merged pair of characters breaks the read.",
      "Letterboxing instead of stretching keeps character shapes intact, which removed the spurious splits.",
      "Rotation-invariant and needs no per-crop threshold sweep.",
    ],
  },

  PaddleOCR: {
    example: "paddleocr",
    role: "Reads the text once it has been found. The general recogniser is a PP-OCRv3 model fine-tuned on drawing crops; a second recogniser handles GD&T frames, and PP-OCRv6 detection is used for the infoblock.",
    stats: [
      { label: "Training rows", value: "64,009" },
      { label: "Crops (48,640 real, rest synthetic)", value: "62,168" },
      { label: "Dictionary", value: "108 characters" },
      { label: "Held-out benchmark", value: "480 crops + 278 rare probes" },
      { label: "Character accuracy", value: "96.7 %" },
      { label: "Speed", value: "~6 ms per crop" },
    ],
    config: [
      {
        title: "General recogniser",
        rows: [
          { label: "Architecture", value: "PP-OCRv3 · SVTR-LCNet · CTC + SAR" },
          { label: "Input", value: "48 × 320" },
          { label: "Max label length", value: "25 characters" },
          { label: "Serving", value: "OpenVINO FP16, no Paddle at runtime" },
        ],
      },
    ],
    heatmap: {
      title: "Exact match by kind of text, v2 against v3",
      rows: [
        "Prose",
        "Decimal comma",
        "Decimal point",
        "Long numbers",
        "ß and ss",
        "Umlauts and capitals",
        "O against 0",
        "Rare symbols",
      ],
      columns: ["v2", "v3"],
      values: [
        [78, 87],
        [93, 93],
        [92, 92],
        [93, 92],
        [88, 88],
        [90, 83],
        [80, 80],
        [70, 55],
      ],
      digits: 0,
      suffix: " %",
      note: "On text both versions can spell, the two tie at 86.2 % exact match and 98.1 % character accuracy. v3 gave up nine rarely used characters on purpose, which is the pale cell at the bottom.",
    },
    notes: [
      "Every change from v2 to v3 is logged operation by operation, so any row in the training set can be traced back to where it came from.",
      "Long crops are split before recognition: on 230 sampled long crops the split read was better 84 % of the time and never worse; character error rate fell from 0.0320 to 0.0255.",
      "PP-OCRv6 detection found 99.6 % of infoblock text against 92.2 % for the previous detector.",
    ],
  },

  "LayoutLM v1 · v2 · v3": {
    example: "layoutlm",
    role: "Reads the infoblock as text plus position on the page, without an image branch. One model marks personal and company data so it can be redacted; a second assigns each token to one of 22 fields such as drawing number, material or scale.",
    stats: [
      { label: "Labelled infoblocks", value: "446" },
      { label: "Token accuracy", value: "96.5 %" },
      { label: "Macro F1 on sensitive labels", value: "0.861" },
      { label: "Best epoch", value: "22 of 30" },
      { label: "Field model · warm", value: "8–10 s" },
      { label: "Field model · cold start", value: "13–17 s" },
    ],
    config: [
      {
        title: "Sensitive-data model",
        rows: [
          { label: "Base", value: "LayoutLM v1 base, uncased" },
          {
            label: "Labels",
            value: "person · company · location · contact · other",
          },
          { label: "Batch · epochs", value: "4 · 30" },
          {
            label: "Export",
            value: "PyTorch → ONNX (opset 14) → OpenVINO FP16",
          },
          { label: "Serving", value: "CPU Lambda, no PyTorch in the image" },
        ],
      },
      {
        title: "Field model",
        rows: [
          { label: "Output", value: "22 fields · 45 BIO labels" },
          { label: "Lambda memory", value: "10,240 MB" },
        ],
      },
    ],
    chart: {
      title: "Macro F1 on sensitive labels, by epoch",
      unit: "Epoch",
      points: curves.layoutlmF1,
      mark: { index: 22, label: "best 0.861" },
    },
    heatmap: {
      title: "Validation scores every second epoch, in percent",
      rows: ["Token accuracy", "Macro F1"],
      columns: ["2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22"],
      values: [
        [94.0, 95.5, 95.9, 95.7, 96.3, 96.0, 96.3, 96.0, 96.3, 96.1, 96.5],
        [37.0, 49.2, 75.9, 77.0, 82.0, 83.6, 82.0, 81.9, 82.7, 81.5, 86.1],
      ],
      digits: 1,
      scale: "row",
      compact: true,
      note: "Token accuracy is high from the start because most tokens are not sensitive. Macro F1 on the sensitive labels is the number that shows the model learning, which is why the best checkpoint was picked on it.",
    },
    notes: [
      "A plain NER model and a vision-language model were both tried for redaction and rejected: neither used the layout, which is what separates a name from a part description.",
      "Exported with dynamic batch and sequence axes so one file serves any infoblock length.",
      "An earlier version used an object detector trained on automatically generated labels; LayoutLM replaced it.",
    ],
  },

  "5-class symbol detector": {
    example: "symbols-5class",
    role: "The central detector of the pipeline. One model finds five kinds of symbol on a drawing as rotated boxes: surface roughness, chamfer, edge tolerance, GD&T frames and welding symbols. It replaced three separate per-class models, and runs over tiles of the page on CPU.",
    stats: [
      { label: "Precision · recall", value: "0.979 · 0.985" },
      { label: "mAP50 · mAP50-95", value: "0.992 · 0.977" },
      { label: "Training tiles", value: "140,608" },
      { label: "Labelled symbols in training", value: "460,551" },
      { label: "Empty tiles kept as negatives", value: "11,388" },
      { label: "Full pages behind the tiles", value: "15,114" },
      { label: "Validation", value: "4,538 tiles, real pages only" },
      { label: "Stopped early", value: "epoch 55, best 44" },
    ],
    config: [
      {
        title: "Training",
        rows: [
          { label: "Model", value: "YOLO11l-OBB" },
          { label: "Input · batch", value: "1600 px · 64 on 8 GPUs" },
          { label: "Epochs · patience", value: "100 · 20" },
          {
            label: "LR · momentum · weight decay",
            value: "0.01 · 0.937 · 0.0005",
          },
          {
            label: "Augmentation",
            value: "scale 0.3 · no mosaic, flips or rotation",
          },
        ],
      },
      {
        title: "Data and serving",
        rows: [
          { label: "Tiles", value: "1600 × 1600 px on an 800 px stride" },
          { label: "Page split", value: "13,968 train · 573 val · 573 test" },
          {
            label: "Synthetic symbols",
            value: "pasted onto real pages, training split only",
          },
          { label: "Serving", value: "OpenVINO on CPU Lambda, per tile" },
        ],
      },
    ],
    chart: {
      title: "mAP50-95 on validation, by epoch",
      unit: "Epoch",
      points: curves.yoloObb,
      mark: { index: 44, label: "best 0.977" },
    },
    heatmap: {
      title: "Validation scores as training went on",
      rows: ["Precision", "Recall", "mAP50", "mAP50-95"],
      columns: ["1", "5", "10", "20", "30", "44", "55"],
      values: [
        [0.956, 0.971, 0.973, 0.978, 0.978, 0.979, 0.982],
        [0.947, 0.978, 0.984, 0.982, 0.984, 0.985, 0.981],
        [0.977, 0.99, 0.991, 0.991, 0.992, 0.992, 0.992],
        [0.937, 0.97, 0.972, 0.974, 0.976, 0.977, 0.976],
      ],
      digits: 3,
      scale: "row",
      compact: true,
      note: "Columns are epochs. Most of the gain arrives in the first five; after that precision keeps creeping up while recall peaks around the best checkpoint and then slips, which is the trade the early stop caught.",
    },
    notes: [
      "Flips and rotation are switched off: a mirrored surface-roughness symbol is a different instruction, so the orientation has to survive augmentation.",
      "Validation and test use real pages only. Synthetic symbols exist only in the training split, so the scores describe real drawings.",
      "About one empty tile in ten is kept as a negative, to teach the model where not to fire.",
      "Tiling was checked so every symbol is at least 80 % visible in some tile; fragments at tile edges are left unlabelled on purpose.",
    ],
  },

  "Nano symbol detector": {
    example: "symbols-nano",
    role: "The small symbol detector that runs in the pipeline as its property detector. It finds the same five symbol classes as rotated boxes, but on 640 px windows instead of full page tiles, so it can confirm or recover a symbol on a close-up without paying for the large model.",
    stats: [
      { label: "Precision · recall", value: "0.985 · 0.991" },
      { label: "mAP50 · mAP50-95", value: "0.994 · 0.980" },
      { label: "Training crops", value: "182,197" },
      { label: "Validation crops", value: "32,153" },
      { label: "Classes", value: "5" },
      { label: "Stopped early", value: "epoch 34, best 32" },
    ],
    config: [
      {
        title: "Training",
        rows: [
          { label: "Model", value: "YOLO26n-OBB, trained from scratch" },
          { label: "Input · batch", value: "640 px · 256 on 8 GPUs" },
          { label: "Epochs · patience", value: "150 · 20" },
          {
            label: "Augmentation",
            value: "mosaic on, closed for the last 10 epochs · scale 0.5",
          },
          { label: "Flips · rotation", value: "off" },
        ],
      },
    ],
    chart: {
      title: "mAP50-95 on validation, by epoch",
      unit: "Epoch",
      points: curves.yolo_nano,
      mark: { index: 32, label: "best 0.980" },
    },
    heatmap: {
      title: "Validation scores as training went on",
      rows: ["Precision", "Recall", "mAP50", "mAP50-95"],
      columns: ["1", "3", "8", "17", "26", "32", "34"],
      values: [
        [0.571, 0.868, 0.971, 0.981, 0.985, 0.985, 0.984],
        [0.53, 0.84, 0.976, 0.989, 0.991, 0.991, 0.989],
        [0.537, 0.909, 0.992, 0.994, 0.994, 0.994, 0.994],
        [0.328, 0.806, 0.968, 0.979, 0.98, 0.98, 0.98],
      ],
      digits: 3,
      scale: "row",
      compact: true,
      note: "Columns are epochs. Starting without pretrained weights, the model is poor for the first few epochs and reaches its plateau by epoch 17.",
    },
    notes: [
      "Its head needs no non-maximum suppression: it returns up to 300 one-to-one candidates, so decoding is a threshold and a rotation.",
      "Trained from the architecture file, not from pretrained weights, which is why the first epochs score so low.",
      "Flips and rotation stay off for the same reason as in the main detector: orientation is part of what a symbol means.",
      "Mosaic is switched off for the last ten epochs so the model finishes on undistorted crops.",
    ],
  },

  "Drawing-area segmentation": {
    example: "drawing-seg",
    role: "Masks the part of the page that is actually the drawing, separating it from the frame, the infoblock and the margins. Everything downstream works inside that mask.",
    stats: [
      { label: "Mask precision · recall", value: "1.000 · 0.992" },
      { label: "Mask mAP50 · mAP50-95", value: "0.995 · 0.989" },
      { label: "Epochs run", value: "189 of 200" },
      { label: "Input", value: "1024 px" },
    ],
    config: [
      {
        title: "Training",
        rows: [
          { label: "Model", value: "YOLOv8s-seg, trained from scratch" },
          { label: "Input · batch", value: "1024 px · 16" },
          { label: "Epochs · patience", value: "200 · 100" },
          {
            label: "Augmentation",
            value: "mosaic on, closed for the last 10 epochs · scale 0.5",
          },
          { label: "Flips · rotation", value: "off" },
        ],
      },
    ],
    chart: {
      title: "Mask mAP50-95 on validation, by epoch",
      unit: "Epoch",
      points: curves.yolo_seg,
      mark: { index: 189, label: "best 0.989" },
    },
    heatmap: {
      title: "Mask scores as training went on",
      rows: ["Precision", "Recall", "mAP50", "mAP50-95"],
      columns: ["19", "47", "94", "142", "189"],
      values: [
        [0.998, 0.999, 1.0, 1.0, 1.0],
        [0.991, 0.992, 0.992, 0.992, 0.992],
        [0.995, 0.995, 0.995, 0.995, 0.995],
        [0.981, 0.988, 0.988, 0.988, 0.989],
      ],
      digits: 3,
      scale: "row",
      compact: true,
      note: "Columns are epochs. The task is close to solved by epoch 19; the remaining 170 epochs add less than one point of mask quality.",
    },
    notes: [
      "One large, regular shape per page makes this an easy problem for a small model, which is why the smallest segmentation variant was enough.",
      "The long patience let it run almost to the end; the curve shows it could have stopped far earlier.",
    ],
  },

  "Logo detector": {
    example: "logo",
    role: "Finds the company logo inside the infoblock. A logo identifies the customer as surely as a name does, so it has to be located before a drawing can be anonymised.",
    stats: [
      { label: "Precision · recall", value: "0.999 · 0.994" },
      { label: "mAP50 · mAP50-95", value: "0.995 · 0.973" },
      { label: "Training crops", value: "5,485" },
      { label: "Validation crops", value: "1,036" },
      { label: "Epochs run", value: "43" },
    ],
    config: [
      {
        title: "Training",
        rows: [
          { label: "Model", value: "YOLO11s, pretrained" },
          { label: "Input · batch", value: "1280 px · 256 on 8 GPUs" },
          { label: "Optimiser", value: "AdamW · LR 0.001" },
          { label: "Epochs · patience", value: "200 · 40" },
          {
            label: "Augmentation",
            value: "mosaic on · horizontal flip 0.5 · rotation ±5° · scale 0.3",
          },
        ],
      },
    ],
    chart: {
      title: "mAP50-95 on validation, by epoch",
      unit: "Epoch",
      points: curves.yolo_logo,
      mark: { index: 43, label: "best 0.973" },
    },
    heatmap: {
      title: "Validation scores as training went on",
      rows: ["Precision", "Recall", "mAP50", "mAP50-95"],
      columns: ["1", "4", "11", "22", "32", "43"],
      values: [
        [0.612, 0.874, 0.882, 0.923, 0.995, 0.999],
        [0.352, 0.937, 0.959, 0.967, 0.99, 0.994],
        [0.423, 0.956, 0.97, 0.986, 0.995, 0.995],
        [0.184, 0.754, 0.887, 0.935, 0.958, 0.973],
      ],
      digits: 3,
      scale: "row",
      compact: true,
      note: "Columns are epochs. Recall is high early; precision is what takes time, climbing from 0.92 to 0.999 over the second half.",
    },
    notes: [
      "Unlike the symbol detectors, flips and a small rotation are allowed here: a mirrored logo is still a logo.",
      "Precision matters most. A false logo box would blank out part of the infoblock that should stay readable.",
    ],
  },

  "GD&T cell detector": {
    example: "gdt-cells",
    role: "Splits a GD&T frame into its cells: the symbol, the tolerance value and each datum reference. The recogniser then reads one cell at a time instead of the whole frame.",
    stats: [
      { label: "Precision · recall", value: "0.992 · 0.987" },
      { label: "mAP50 · mAP50-95", value: "0.994 · 0.946" },
      { label: "Epochs run", value: "49, best 43" },
      { label: "Input", value: "640 px" },
    ],
    config: [
      {
        title: "Training",
        rows: [
          { label: "Model", value: "YOLO11n, pretrained" },
          { label: "Input · batch", value: "640 px · 8 on one GPU" },
          { label: "Epochs · patience", value: "100 · 20" },
          {
            label: "Augmentation",
            value: "mosaic 0.5 · vertical flip 0.5 · rotation ±3° · scale 0.2",
          },
        ],
      },
    ],
    chart: {
      title: "mAP50-95 on validation, by epoch",
      unit: "Epoch",
      points: curves.yolo_cells,
      mark: { index: 43, label: "best 0.946" },
    },
    heatmap: {
      title: "Validation scores as training went on",
      rows: ["Precision", "Recall", "mAP50", "mAP50-95"],
      columns: ["1", "5", "12", "24", "37", "43", "49"],
      values: [
        [0.983, 0.991, 0.99, 0.991, 0.992, 0.992, 1.0],
        [0.963, 0.988, 0.986, 0.987, 0.988, 0.987, 0.986],
        [0.977, 0.99, 0.987, 0.99, 0.992, 0.994, 0.994],
        [0.817, 0.88, 0.888, 0.922, 0.937, 0.946, 0.945],
      ],
      digits: 3,
      scale: "row",
      compact: true,
      note: "Columns are epochs. Finding the cells is easy from the first epoch; what improves with training is how tightly the boxes fit, the mAP50-95 row.",
    },
    notes: [
      "Box tightness is the number that matters here: a loose cell box drags a neighbouring character into the read.",
      "A nano model is enough, and it runs once per frame, so the cost stays negligible.",
    ],
  },

  "Edge-tolerance symbol detector": {
    example: "edge-tolerance",
    role: "Finds the small L-shaped edge-tolerance symbol, which states how sharp or broken an edge may be. It is tiny, rare and easy to confuse with ordinary line corners.",
    stats: [
      { label: "Precision · recall", value: "0.985 · 0.979" },
      { label: "mAP50 · mAP50-95", value: "0.991 · 0.877" },
      { label: "Training crops", value: "609" },
      { label: "Validation crops", value: "100" },
      { label: "Epochs run", value: "83, best 80" },
    ],
    config: [
      {
        title: "Training",
        rows: [
          { label: "Model", value: "YOLO11n, pretrained" },
          { label: "Input · batch", value: "640 px · 16" },
          { label: "Hardware", value: "laptop GPU" },
          { label: "Epochs · patience", value: "100 · 20" },
          {
            label: "Augmentation",
            value: "both flips 0.5 · scale 0.2 · no mosaic",
          },
        ],
      },
    ],
    chart: {
      title: "mAP50-95 on validation, by epoch",
      unit: "Epoch",
      points: curves.yolo_edge,
      mark: { index: 80, label: "best 0.877" },
    },
    heatmap: {
      title: "Validation scores as training went on",
      rows: ["Precision", "Recall", "mAP50", "mAP50-95"],
      columns: ["1", "8", "21", "42", "62", "80", "83"],
      values: [
        [0.762, 0.929, 0.966, 0.958, 0.989, 0.985, 0.98],
        [0.608, 0.873, 0.907, 0.959, 0.97, 0.979, 0.989],
        [0.723, 0.93, 0.958, 0.983, 0.989, 0.991, 0.99],
        [0.509, 0.753, 0.814, 0.81, 0.835, 0.877, 0.856],
      ],
      digits: 3,
      scale: "row",
      compact: true,
      note: "Columns are epochs. With only 609 training crops the model finds the symbol reliably, but box tightness stays the weakest score.",
    },
    notes: [
      "The smallest dataset of the group, and it shows in mAP50-95. The five-class detector also covers edge tolerances, with far more examples.",
      "Small enough to train on a laptop in one sitting.",
    ],
  },

  "View detector": {
    example: "views",
    role: "A first attempt at finding the separate views on a drawing page with plain boxes. It works on simple pages and fails where views overlap or nest, which is what led to the segmentation models.",
    stats: [
      { label: "Precision · recall", value: "0.919 · 0.900" },
      { label: "mAP50 · mAP50-95", value: "0.954 · 0.767" },
      { label: "Training pages", value: "899" },
      { label: "Validation pages", value: "100" },
      { label: "Epochs run", value: "100, best 86" },
    ],
    config: [
      {
        title: "Training",
        rows: [
          { label: "Model", value: "YOLO11m, pretrained" },
          { label: "Input · batch", value: "640 px · 8" },
          { label: "Epochs · patience", value: "100 · 15" },
          {
            label: "Augmentation",
            value: "mosaic on · both flips 0.5 · rotation ±90° · scale 0.5",
          },
        ],
      },
    ],
    chart: {
      title: "mAP50-95 on validation, by epoch",
      unit: "Epoch",
      points: curves.yolo_views,
      mark: { index: 86, label: "best 0.767" },
    },
    heatmap: {
      title: "Validation scores as training went on",
      rows: ["Precision", "Recall", "mAP50", "mAP50-95"],
      columns: ["1", "10", "25", "50", "75", "86", "100"],
      values: [
        [0.019, 0.693, 0.17, 0.825, 0.922, 0.919, 0.902],
        [0.358, 0.679, 0.144, 0.729, 0.886, 0.9, 0.768],
        [0.012, 0.724, 0.093, 0.815, 0.94, 0.954, 0.879],
        [0.005, 0.308, 0.024, 0.592, 0.72, 0.767, 0.679],
      ],
      digits: 3,
      scale: "row",
      compact: true,
      note: "Columns are epochs. Training was unstable: the scores drop to almost nothing around epoch 25 and recover, and they fall again after the best epoch.",
    },
    notes: [
      "A box cannot describe a view that wraps around another one, so even a correct detection is a poor answer on those pages.",
    ],
  },

  "RF-DETR-Seg": {
    example: "rfdetr",
    role: "An experiment on a hard problem: outlining each separate view on a drawing page. It was trained on exactly the same pages as the YOLO segmentation runs, then scored with the same script, so the numbers line up directly.",
    stats: [
      { label: "Train · val · test pages", value: "753 · 89 · 46" },
      { label: "Views in the test set", value: "365" },
      { label: "Precision · recall", value: "0.970 · 0.978" },
      { label: "Pages with every view right", value: "35 of 46" },
      { label: "Exported weights", value: "~203 MB" },
    ],
    config: [
      {
        title: "Training",
        rows: [
          { label: "Model", value: "RF-DETR-Seg 2XLarge" },
          { label: "Input", value: "2544 px" },
          { label: "Hardware", value: "8 GPUs, distributed" },
          { label: "Scale jitter", value: "off" },
          { label: "Validation masks", value: "compared at 636 px" },
        ],
      },
    ],
    table: {
      title: "Same 46 test pages",
      columns: ["Model", "Precision", "Recall", "Pages all correct"],
      rows: [
        ["YOLO11m-seg", "0.837", "0.945", "23"],
        ["YOLO26m-seg", "0.915", "0.915", "26"],
        ["YOLO26m-seg, flips + zoom", "0.928", "0.953", "29"],
        ["YOLO26m-seg, 150 epochs", "0.945", "0.945", "31"],
        ["RF-DETR-Seg 2XL", "0.970", "0.978", "35"],
      ],
    },
    heatmap: {
      title: "RF-DETR recall by size of view, at four inference settings",
      rows: [
        "1792 px, raw output",
        "2560 px, raw output",
        "1792 px, cleaned",
        "2560 px, cleaned",
      ],
      columns: ["≤ 480 px", "480–960", "960–1500", "1500–1800", "> 1800"],
      values: [
        [0.97, 1.0, 1.0, 1.0, 1.0],
        [0.979, 0.99, 1.0, 1.0, 1.0],
        [0.97, 0.99, 0.952, 1.0, 1.0],
        [0.97, 0.99, 1.0, 1.0, 1.0],
      ],
      digits: 3,
      note: "Views counted per column: 236, 98, 21, 8 and 2. Large views, the ones the YOLO runs struggled with, are all found; the few misses are among the smallest. Cleaning the output lifts precision from 0.867 to 0.970 at a small cost in recall.",
    },
    notes: [
      "Scale jitter had to go: its shrink-and-crop step erases the thin lines a drawing is made of.",
      "Validation masks are compared at the mask head's own size, which avoided roughly 8 GB of memory per page.",
      "The OpenVINO export reproduces the PyTorch masks exactly, but takes 120–240 s per page on CPU. Best accuracy of the group, too slow for a CPU Lambda, so it stays an experiment.",
    ],
  },

  LightGBM: {
    example: "note-blocks",
    role: "Decides which lines of text on a drawing belong to the same note. Every nearby pair of lines is scored as same-note or not from layout, style and text signals, and the pairs are then joined into blocks.",
    stats: [
      { label: "Labelled drawings", value: "558" },
      { label: "Held-out drawings", value: "80" },
      { label: "Drawings grouped perfectly", value: "54 of 80" },
      { label: "Pair F1", value: "0.785" },
      { label: "Warm · cold", value: "50–150 ms · 2–4 s" },
      { label: "Deploy bundle", value: "~140 MB" },
    ],
    config: [
      {
        title: "Pipeline",
        rows: [
          { label: "Classifier", value: "LightGBM, pairwise" },
          {
            label: "Features",
            value: "43: layout, style, content, reading order",
          },
          {
            label: "Text signal",
            value: "frozen multilingual MiniLM, int8 ONNX",
          },
          { label: "Decoding", value: "union-find over accepted pairs" },
        ],
      },
    ],
    table: {
      title: "Same 80 held-out drawings",
      columns: ["Metric", "Previous model", "Current"],
      rows: [
        ["Features", "24", "43"],
        ["Drawings grouped perfectly", "38", "54"],
        ["Pair F1", "0.697", "0.785"],
      ],
    },
    heatmap: {
      title: "Same 80 held-out drawings, three versions",
      rows: [
        "Previous model, as deployed",
        "Previous model, best threshold",
        "Current model",
      ],
      columns: ["Precision", "Recall", "F1"],
      values: [
        [0.592, 0.798, 0.638],
        [0.748, 0.711, 0.697],
        [0.793, 0.798, 0.785],
      ],
      digits: 3,
      note: "Tuning the old model's threshold only traded recall for precision. The new features raised precision while keeping recall where it started.",
    },
    notes: [
      "Built the annotation tool that goes with it: the model's own prediction is the starting point, so a reviewer accepts with one key or fixes the few wrong links.",
      "The decoder threshold is swept again after every retrain, because the small text-pair network shifts it from run to run.",
      "Shipped as LightGBM plus two small ONNX files, so the Lambda needs no deep-learning framework.",
    ],
  },
};
