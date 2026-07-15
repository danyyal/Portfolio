import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Container,
  createTheme,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Calculate,
  Close,
  Delete,
  Download,
  Edit,
  Email,
  LocationOn,
  OpenInNew,
  Person,
  PersonAddAlt1,
  Phone,
  PictureAsPdf,
  Print,
  Send,
  TableChart,
  Visibility,
} from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";

/* ---------- popup portal ---------- */

const DepWindow = ({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) => (
  <Box
    sx={{
      position: "fixed",
      inset: 0,
      bgcolor: "rgba(0,0,0,0.55)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      p: 2,
    }}
    onClick={onClose}
  >
    <Paper
      elevation={12}
      onClick={(e) => e.stopPropagation()}
      sx={{
        borderRadius: 2,
        maxWidth: "92vw",
        maxHeight: "88vh",
        overflow: "auto",
      }}
    >
      <AppBar position="sticky" color="primary" enableColorOnDark>
        <Toolbar variant="dense">
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton color="inherit" onClick={onClose} aria-label="Close">
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box p={{ xs: 2, md: 3 }}>{children}</Box>
    </Paper>
  </Box>
);

/* ---------- example 1: customer profile ---------- */

const CustomerProfile = () => (
  <Card>
    <CardHeader
      avatar={
        <Avatar sx={{ bgcolor: "primary.main" }}>
          <Person />
        </Avatar>
      }
      title="Customer Profile"
      subheader="Detailed customer information"
      action={
        <Box>
          <IconButton aria-label="Edit">
            <Edit />
          </IconButton>
          <IconButton aria-label="Print">
            <Print />
          </IconButton>
        </Box>
      }
    />
    <CardContent>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <List dense>
            {[
              {
                icon: <Person />,
                primary: "John Smith",
                secondary: "Customer ID: #12345",
              },
              {
                icon: <Email />,
                primary: "john.smith@email.com",
                secondary: "Primary Email",
              },
              {
                icon: <Phone />,
                primary: "+1 (555) 123-4567",
                secondary: "Mobile",
              },
              {
                icon: <LocationOn />,
                primary: "123 Main St, New York, NY 10001",
                secondary: "Billing Address",
              },
            ].map((item) => (
              <ListItem key={item.secondary}>
                <ListItemAvatar>
                  <Avatar>{item.icon}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={item.primary}
                  secondary={item.secondary}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>
            Account Details
          </Typography>
          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Chip label="Premium Customer" color="primary" />
            <Chip label="Active" color="success" />
            <Chip label="Verified" color="info" />
          </Box>
          <Typography variant="body2" sx={{ mt: 3 }}>
            Account Balance:
          </Typography>
          <Typography variant="h4" color="success.main">
            $2,450.00
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Member Since:
          </Typography>
          <Typography variant="body1">January 15, 2020</Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

/* ---------- example 2: data table ---------- */

const employees = [
  { id: 1, name: "Alice Johnson", department: "Engineering", salary: 85000, status: "Active", joinDate: "2021-03-15" },
  { id: 2, name: "Bob Wilson", department: "Marketing", salary: 65000, status: "Active", joinDate: "2020-07-22" },
  { id: 3, name: "Carol Davis", department: "Sales", salary: 75000, status: "On Leave", joinDate: "2019-11-08" },
  { id: 4, name: "David Brown", department: "HR", salary: 70000, status: "Active", joinDate: "2022-01-10" },
  { id: 5, name: "Emma Wilson", department: "Engineering", salary: 90000, status: "Active", joinDate: "2020-05-18" },
];

const EmployeeDataTable = () => (
  <Card>
    <CardHeader
      title="Employee Management"
      subheader="Company employee records"
      action={
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button variant="outlined" startIcon={<Download />}>
            Export
          </Button>
          <Button variant="contained" startIcon={<Person />}>
            Add Employee
          </Button>
        </Box>
      }
    />
    <CardContent>
      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 640 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell align="right">Salary</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id} hover>
                <TableCell>{employee.id}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 1.5, width: 30, height: 30 }}>
                      {employee.name.charAt(0)}
                    </Avatar>
                    {employee.name}
                  </Box>
                </TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold">
                    ${employee.salary.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>{employee.joinDate}</TableCell>
                <TableCell>
                  <Chip
                    label={employee.status}
                    color={employee.status === "Active" ? "success" : "warning"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                  <IconButton size="small" color="primary" aria-label="View">
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="primary" aria-label="Edit">
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" aria-label="Delete">
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);

/* ---------- example 3: invoice ---------- */

const InvoiceViewer = () => (
  <Card>
    <CardHeader
      title="Invoice #INV-2024-001"
      subheader="March 15, 2024"
      action={
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button variant="outlined" startIcon={<Print />}>
            Print
          </Button>
          <Button variant="contained" startIcon={<Download />}>
            Download PDF
          </Button>
        </Box>
      }
    />
    <Divider />
    <CardContent>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>
            From:
          </Typography>
          <Typography variant="body1">
            <strong>ACME Corporation</strong>
          </Typography>
          <Typography variant="body2">123 Business Ave</Typography>
          <Typography variant="body2">New York, NY 10001</Typography>
          <Typography variant="body2">tax@acme.com</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>
            To:
          </Typography>
          <Typography variant="body1">
            <strong>Client Company Ltd.</strong>
          </Typography>
          <Typography variant="body2">456 Client Street</Typography>
          <Typography variant="body2">Boston, MA 02101</Typography>
          <Typography variant="body2">billing@client.com</Typography>
        </Grid>
      </Grid>

      <TableContainer component={Paper} variant="outlined" sx={{ mt: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              ["Web Development Services", "40 hrs", "$150.00", "$6,000.00"],
              ["UI/UX Design", "20 hrs", "$120.00", "$2,400.00"],
              ["Project Management", "10 hrs", "$100.00", "$1,000.00"],
            ].map(([desc, qty, unit, total]) => (
              <TableRow key={desc}>
                <TableCell>{desc}</TableCell>
                <TableCell align="center">{qty}</TableCell>
                <TableCell align="right">{unit}</TableCell>
                <TableCell align="right">
                  <strong>{total}</strong>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right">
                Subtotal:
              </TableCell>
              <TableCell align="right">$9,400.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} align="right">
                Tax (8.5%):
              </TableCell>
              <TableCell align="right">$799.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} align="right">
                <Typography variant="h6" color="primary">
                  Total:
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h6" color="primary">
                  $10,199.00
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Alert severity="info" sx={{ mt: 3 }}>
        Payment is due within 30 days of invoice date. Late payments may incur
        additional fees.
      </Alert>
    </CardContent>
  </Card>
);

/* ---------- example 4: calculator ---------- */

const AdvancedCalculator = () => {
  const [display, setDisplay] = useState("0");

  const press = (btn: string) => {
    if (btn === "C") return setDisplay("0");
    if (btn === "=") {
      try {
        const expr = display.replace(/×/g, "*").replace(/÷/g, "/");
        if (/^[\d+\-*/.() ]+$/.test(expr)) {
          const value = Function(`"use strict"; return (${expr})`)();
          setDisplay(String(Math.round(value * 1e8) / 1e8));
        }
      } catch {
        setDisplay("Error");
      }
      return;
    }
    setDisplay((prev) => (prev === "0" || prev === "Error" ? btn : prev + btn));
  };

  const keys = ["C", "(", ")", "÷", "7", "8", "9", "×", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "="];

  return (
    <Card sx={{ maxWidth: 380, mx: "auto" }}>
      <CardHeader title="Calculator" subheader="A tiny working calculator" />
      <CardContent>
        <TextField
          fullWidth
          value={display}
          variant="outlined"
          sx={{ mb: 2 }}
          slotProps={{
            input: { readOnly: true, sx: { fontSize: "1.4rem" } },
            htmlInput: { "aria-label": "Calculator display" },
          }}
        />
        <Grid container spacing={1}>
          {keys.map((btn) => (
            <Grid size={btn === "=" ? 6 : 3} key={btn}>
              <Button
                variant={
                  ["=", "+", "-", "×", "÷"].includes(btn)
                    ? "contained"
                    : "outlined"
                }
                color={
                  btn === "=" ? "success" : btn === "C" ? "secondary" : "primary"
                }
                fullWidth
                sx={{ height: 48, fontWeight: "bold" }}
                onClick={() => press(btn)}
              >
                {btn}
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

/* ---------- example 5: user registration form ---------- */

type UserForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  terms: boolean;
};

const emptyUser: UserForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "",
  terms: false,
};

const UserRegistrationForm = () => {
  const [form, setForm] = useState<UserForm>(emptyUser);
  const [errors, setErrors] = useState<Partial<Record<keyof UserForm, string>>>(
    {},
  );
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof UserForm>(key: K, value: UserForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const next: typeof errors = {};
    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.lastName.trim()) next.lastName = "Last name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (form.password.length < 8) next.password = "At least 8 characters";
    if (!form.role) next.role = "Pick a role";
    if (!form.terms) next.terms = "You must accept the terms";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSaved(true);
      setForm(emptyUser);
    }
  };

  return (
    <Card sx={{ maxWidth: 640, mx: "auto" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <PersonAddAlt1 />
          </Avatar>
        }
        title="Create User"
        subheader="Registration form with inline validation"
      />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="First Name"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Last Name"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="password"
                label="Password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                error={!!errors.password}
                helperText={errors.password ?? "Minimum 8 characters"}
              />
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth required error={!!errors.role}>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  label="Role"
                  value={form.role}
                  onChange={(e) => set("role", e.target.value)}
                >
                  <MenuItem value="admin">Administrator</MenuItem>
                  <MenuItem value="editor">Editor</MenuItem>
                  <MenuItem value="viewer">Viewer</MenuItem>
                </Select>
                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={12}>
              <FormControl error={!!errors.terms}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.terms}
                      onChange={(e) => set("terms", e.target.checked)}
                    />
                  }
                  label="I accept the terms and conditions"
                />
                {errors.terms && (
                  <FormHelperText>{errors.terms}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setForm(emptyUser);
                    setErrors({});
                  }}
                >
                  Reset
                </Button>
                <Button type="submit" variant="contained">
                  Create Account
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
      <Snackbar
        open={saved}
        autoHideDuration={3500}
        onClose={() => setSaved(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSaved(false)}>
          User created successfully (demo — nothing is stored).
        </Alert>
      </Snackbar>
    </Card>
  );
};

/* ---------- example 6: contact form ---------- */

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const emptyContact: ContactFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const ContactForm = () => {
  const [form, setForm] = useState<ContactFormState>(emptyContact);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormState, string>>
  >({});
  const [sent, setSent] = useState(false);

  const set = <K extends keyof ContactFormState>(
    key: K,
    value: ContactFormState[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Your name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.subject) next.subject = "Pick a subject";
    if (form.message.trim().length < 10)
      next.message = "Tell me a bit more (min 10 characters)";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSent(true);
      setForm(emptyContact);
    }
  };

  return (
    <Card sx={{ maxWidth: 640, mx: "auto" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <Email />
          </Avatar>
        }
        title="Contact Me"
        subheader="Get in touch about a project or collaboration"
      />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth required error={!!errors.subject}>
                <InputLabel id="subject-label">Subject</InputLabel>
                <Select
                  labelId="subject-label"
                  label="Subject"
                  value={form.subject}
                  onChange={(e) => set("subject", e.target.value)}
                >
                  <MenuItem value="project">New project inquiry</MenuItem>
                  <MenuItem value="freelance">Freelance engagement</MenuItem>
                  <MenuItem value="collab">Collaboration</MenuItem>
                  <MenuItem value="other">Something else</MenuItem>
                </Select>
                {errors.subject && (
                  <FormHelperText>{errors.subject}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Message"
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                error={!!errors.message}
                helperText={errors.message}
              />
            </Grid>
            <Grid size={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setForm(emptyContact);
                    setErrors({});
                  }}
                >
                  Clear
                </Button>
                <Button type="submit" variant="contained" endIcon={<Send />}>
                  Send Message
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
      <Snackbar
        open={sent}
        autoHideDuration={3500}
        onClose={() => setSent(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSent(false)}>
          Message sent — thanks for reaching out! (demo only)
        </Alert>
      </Snackbar>
    </Card>
  );
};

/* ---------- page ---------- */

const examples = [
  { id: "profile", label: "Customer Profile", icon: <Person />, component: CustomerProfile },
  { id: "table", label: "Employee Data", icon: <TableChart />, component: EmployeeDataTable },
  { id: "invoice", label: "Invoice Viewer", icon: <PictureAsPdf />, component: InvoiceViewer },
  { id: "calculator", label: "Calculator", icon: <Calculate />, component: AdvancedCalculator },
  { id: "user-form", label: "User Form", icon: <PersonAddAlt1 />, component: UserRegistrationForm },
  { id: "contact", label: "Contact Form", icon: <Email />, component: ContactForm },
];

const DeepWindowWithMaterialUi = () => {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [popupOpen, setPopupOpen] = useState(false);

  const activeId = searchParams.get("demo") ?? examples[0].id;
  const active =
    examples.find((example) => example.id === activeId) ?? examples[0];
  const ActiveComponent = active.component;

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme,
          primary: { main: theme === "dark" ? "#38bdf8" : "#0284c7" },
          secondary: { main: theme === "dark" ? "#a78bfa" : "#6d28d9" },
          background:
            theme === "dark"
              ? { default: "#081226", paper: "#0d1b33" }
              : { default: "#ffffff", paper: "#ffffff" },
        },
        typography: {
          fontFamily: "Inter, system-ui, sans-serif",
          h3: { fontFamily: "'Space Grotesk', Inter, sans-serif" },
        },
        shape: { borderRadius: 10 },
      }),
    [theme],
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <Box sx={{ py: 6, minHeight: "100vh" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h1"
            align="center"
            gutterBottom
            sx={{ color: "var(--text-primary)", fontWeight: 700 }}
          >
            Material UI{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              Playground
            </Box>
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ color: "var(--text-muted)", mb: 4 }}
          >
            Real-world MUI patterns — profiles, data tables, invoices, and
            validated forms. Each demo is deep-linkable and can pop out into
            its own window.
          </Typography>

          <Paper
            elevation={0}
            sx={{
              mb: 4,
              borderRadius: 3,
              border: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Tabs
              value={active.id}
              onChange={(_, id: string) => setSearchParams({ demo: id })}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              {examples.map((example) => (
                <Tab
                  key={example.id}
                  value={example.id}
                  icon={example.icon}
                  iconPosition="start"
                  label={example.label}
                  sx={{ minHeight: 56, textTransform: "none" }}
                />
              ))}
            </Tabs>
          </Paper>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<OpenInNew />}
              onClick={() => setPopupOpen(true)}
            >
              Open in popup
            </Button>
          </Box>

          <ActiveComponent />
        </Container>

        {popupOpen && (
          <DepWindow title={active.label} onClose={() => setPopupOpen(false)}>
            <ActiveComponent />
          </DepWindow>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default DeepWindowWithMaterialUi;
