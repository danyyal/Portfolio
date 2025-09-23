import React, { useEffect } from "react";
import ReactDOM from "react-dom";
//
interface DepWindowProps {
  children: React.ReactNode;
  closeWindowPortal: () => void;
}

function copyStyles(sourceDoc: Document, targetDoc: Document) {
  Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
    if (styleSheet.cssRules) {
      // true for inline styles
      const newStyleEl = sourceDoc.createElement("style");

      Array.from(styleSheet.cssRules).forEach((cssRule) => {
        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
      });

      targetDoc.head.appendChild(newStyleEl);
    } else if (styleSheet.href) {
      // true for stylesheets loaded from a URL
      const newLinkEl = sourceDoc.createElement("link");

      newLinkEl.rel = "stylesheet";
      newLinkEl.href = styleSheet.href;
      targetDoc.head.appendChild(newLinkEl);
    }
  });
}

export const DepWindow: React.FC<DepWindowProps> = ({
  children,
  closeWindowPortal,
}) => {
  const containerEl = document.createElement("div");

  const openWindow = () => {
    const externalWindow = window.open(
      "",
      "",
      "width=1000,height=800,left=200,top=200",
    );

    if (externalWindow) {
      externalWindow.document.title = "CERPRO Cloud";
      externalWindow.document.body.appendChild(containerEl);
      copyStyles(document, externalWindow.document);
      externalWindow.addEventListener("beforeunload", () => {
        closeWindowPortal();
      });

      return () => {
        externalWindow.close();
      };
    } else {
      console.error("Failed to open external window");
    }
  };

  useEffect(() => {
    openWindow();
  }, [closeWindowPortal, containerEl]);

  return ReactDOM.createPortal(children, containerEl);
};
