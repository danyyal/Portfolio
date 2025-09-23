import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Alert,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Toolbar,
  AppBar,
} from "@mui/material";
import {
  PictureAsPdf,
  TableChart,
  Calculate,
  Person,
  Email,
  Phone,
  LocationOn,
  Edit,
  Delete,
  Visibility,
  Print,
  Download,
  Close,
} from "@mui/icons-material";

const Grid2 = Grid as any;
const DepWindow = ({ children, closeWindowPortal }: any) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        <AppBar
          position="static"
          color="primary"
          style={{ borderRadius: "8px 8px 0 0" }}
        >
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Popup Window
            </Typography>
            <IconButton color="inherit" onClick={closeWindowPortal}>
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box p={2}>{children}</Box>
      </div>
    </div>
  );
};

const DeepWindowWithMaterialUi = () => {
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  const closeWindow = () => setActiveWindow(null);

  // Example 1: Customer Profile Viewer
  const CustomerProfile = () => (
    <Card sx={{ maxWidth: 800, margin: "auto" }}>
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
            <IconButton>
              <Edit />
            </IconButton>
            <IconButton>
              <Print />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        <Grid2 container spacing={3}>
          <Grid2 item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="John Smith"
                  secondary="Customer ID: #12345"
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Email />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="john.smith@email.com"
                  secondary="Primary Email"
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Phone />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="+1 (555) 123-4567" secondary="Mobile" />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <LocationOn />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="123 Main St, New York, NY 10001"
                  secondary="Billing Address"
                />
              </ListItem>
            </List>
          </Grid2>
          <Grid2 item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Account Details
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Chip
                label="Premium Customer"
                color="primary"
                sx={{ mr: 1, mb: 1 }}
              />
              <Chip label="Active" color="success" sx={{ mr: 1, mb: 1 }} />
              <Chip label="Verified" color="info" sx={{ mr: 1, mb: 1 }} />
            </Box>
            <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
              Account Balance:
            </Typography>
            <Typography variant="h4" color="success.main">
              $2,450.00
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
              Member Since:
            </Typography>
            <Typography variant="body1">January 15, 2020</Typography>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );

  // Example 2: Advanced Data Table
  const EmployeeDataTable = () => {
    const employees = [
      {
        id: 1,
        name: "Alice Johnson",
        department: "Engineering",
        salary: 85000,
        status: "Active",
        joinDate: "2021-03-15",
      },
      {
        id: 2,
        name: "Bob Wilson",
        department: "Marketing",
        salary: 65000,
        status: "Active",
        joinDate: "2020-07-22",
      },
      {
        id: 3,
        name: "Carol Davis",
        department: "Sales",
        salary: 75000,
        status: "On Leave",
        joinDate: "2019-11-08",
      },
      {
        id: 4,
        name: "David Brown",
        department: "HR",
        salary: 70000,
        status: "Active",
        joinDate: "2022-01-10",
      },
      {
        id: 5,
        name: "Emma Wilson",
        department: "Engineering",
        salary: 90000,
        status: "Active",
        joinDate: "2020-05-18",
      },
    ];

    return (
      <Card sx={{ minWidth: 900 }}>
        <CardHeader
          title="Employee Management"
          subheader="Company employee records"
          action={
            <Box>
              <Button
                variant="outlined"
                startIcon={<Download />}
                sx={{ mr: 1 }}
              >
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
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.50" }}>
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
                        <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
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
                        color={
                          employee.status === "Active" ? "success" : "warning"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
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
  };

  // Example 3: Invoice/Document Viewer
  const InvoiceViewer = () => (
    <Card sx={{ maxWidth: 800 }}>
      <CardHeader
        title="Invoice #INV-2024-001"
        subheader="March 15, 2024"
        action={
          <Box>
            <Button variant="outlined" startIcon={<Print />} sx={{ mr: 1 }}>
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
        <Grid2 container spacing={4}>
          <Grid2 item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              From:
            </Typography>
            <Typography variant="body1">
              <strong>ACME Corporation</strong>
            </Typography>
            <Typography variant="body2">123 Business Ave</Typography>
            <Typography variant="body2">New York, NY 10001</Typography>
            <Typography variant="body2">tax@acme.com</Typography>
          </Grid2>
          <Grid2 item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              To:
            </Typography>
            <Typography variant="body1">
              <strong>Client Company Ltd.</strong>
            </Typography>
            <Typography variant="body2">456 Client Street</Typography>
            <Typography variant="body2">Boston, MA 02101</Typography>
            <Typography variant="body2">billing@client.com</Typography>
          </Grid2>
        </Grid2>

        <Box sx={{ mt: 4 }}>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "primary.main" }}>
                  <TableCell sx={{ color: "white" }}>Description</TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Quantity
                  </TableCell>
                  <TableCell align="right" sx={{ color: "white" }}>
                    Unit Price
                  </TableCell>
                  <TableCell align="right" sx={{ color: "white" }}>
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Web Development Services</TableCell>
                  <TableCell align="center">40 hrs</TableCell>
                  <TableCell align="right">$150.00</TableCell>
                  <TableCell align="right">
                    <strong>$6,000.00</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>UI/UX Design</TableCell>
                  <TableCell align="center">20 hrs</TableCell>
                  <TableCell align="right">$120.00</TableCell>
                  <TableCell align="right">
                    <strong>$2,400.00</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Project Management</TableCell>
                  <TableCell align="center">10 hrs</TableCell>
                  <TableCell align="right">$100.00</TableCell>
                  <TableCell align="right">
                    <strong>$1,000.00</strong>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: "grey.50" }}>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="h6">Subtotal:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">$9,400.00</Typography>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: "grey.50" }}>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="h6">Tax (8.5%):</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">$799.00</Typography>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: "primary.main" }}>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="h5" sx={{ color: "white" }}>
                      Total:
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h5" sx={{ color: "white" }}>
                      $10,199.00
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Alert severity="info" sx={{ mt: 3 }}>
          Payment is due within 30 days of invoice date. Late payments may incur
          additional fees.
        </Alert>
      </CardContent>
    </Card>
  );

  // Example 4: Advanced Calculator
  const AdvancedCalculator = () => {
    const [result, setResult] = useState("0");
    const [operation] = useState("");

    return (
      <Card sx={{ maxWidth: 400 }}>
        <CardHeader
          title="Scientific Calculator"
          subheader="Advanced calculations"
        />
        <CardContent>
          <TextField
            fullWidth
            value={result}
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              readOnly: true,
              sx: { fontSize: "1.5rem", textAlign: "right" },
            }}
          />
          <Grid2 container spacing={1}>
            {[
              ["C", "±", "%", "÷"],
              ["7", "8", "9", "×"],
              ["4", "5", "6", "-"],
              ["1", "2", "3", "+"],
              ["0", "0", ".", "="],
            ].map((row, rowIndex) => (
              <Grid2 container spacing={1} key={rowIndex} sx={{ mb: 1 }}>
                {row.map((btn, colIndex) => (
                  <Grid2 item xs={3} key={`${rowIndex}-${colIndex}`}>
                    <Button
                      variant={
                        ["=", "+", "-", "×", "÷"].includes(btn)
                          ? "contained"
                          : "outlined"
                      }
                      color={
                        ["="].includes(btn)
                          ? "success"
                          : ["C", "±", "%"].includes(btn)
                            ? "secondary"
                            : "primary"
                      }
                      fullWidth
                      sx={{
                        height: 56,
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                      }}
                      onClick={() => {
                        if (btn === "C") setResult("0");
                        else if (btn !== "=")
                          setResult((prev) =>
                            prev === "0" ? btn : prev + btn,
                          );
                      }}
                    >
                      {btn}
                    </Button>
                  </Grid2>
                ))}
              </Grid2>
            ))}
          </Grid2>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Operation: {operation || "None"}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Example 5: Form in Popup
  const ContactForm = () => (
    <Card sx={{ maxWidth: 600 }}>
      <CardHeader
        title="Contact Information"
        subheader="Update customer contact details"
      />
      <CardContent>
        <Grid2 container spacing={3}>
          <Grid2 item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              defaultValue="John"
            />
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              defaultValue="Smith"
            />
          </Grid2>
          <Grid2 item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              defaultValue="john.smith@email.com"
            />
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              variant="outlined"
              defaultValue="+1 (555) 123-4567"
            />
          </Grid2>
          <Grid2 item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Country</InputLabel>
              <Select defaultValue="US" label="Country">
                <MenuItem value="US">United States</MenuItem>
                <MenuItem value="CA">Canada</MenuItem>
                <MenuItem value="UK">United Kingdom</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 item xs={12}>
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={3}
              variant="outlined"
              defaultValue="123 Main Street, New York, NY 10001"
            />
          </Grid2>
          <Grid2 item xs={12}>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={closeWindow}>
                Cancel
              </Button>
              <Button variant="contained" color="primary">
                Save Changes
              </Button>
            </Box>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );

  const examples = [
    {
      id: "profile",
      label: "Customer Profile",
      icon: Person,
      component: CustomerProfile,
    },
    {
      id: "table",
      label: "Employee Data",
      icon: TableChart,
      component: EmployeeDataTable,
    },
    {
      id: "invoice",
      label: "Invoice Viewer",
      icon: PictureAsPdf,
      component: InvoiceViewer,
    },
    {
      id: "calculator",
      label: "Calculator",
      icon: Calculate,
      component: AdvancedCalculator,
    },
    { id: "form", label: "Contact Form", icon: Edit, component: ContactForm },
  ];

  return (
    <Box sx={{ padding: 4, backgroundColor: "grey.50", minHeight: "100vh" }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        color="primary.main"
      >
        DepWindow with Material-UI
      </Typography>
      <Typography
        variant="h6"
        align="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Click any button to open content in a separate popup window
      </Typography>

      <Grid2 container spacing={3} sx={{ maxWidth: 1200, margin: "0 auto" }}>
        <Grid2 item xs={12}>
          <Card>
            <CardHeader title="Available Examples" />
            <CardContent>
              <Grid2 container spacing={2}>
                {examples.map(({ id, label, icon: Icon }) => (
                  <Grid2 item xs={12} sm={6} md={4} key={id}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<Icon />}
                      onClick={() => setActiveWindow(id)}
                      sx={{ py: 2 }}
                    >
                      {label}
                    </Button>
                  </Grid2>
                ))}
              </Grid2>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 item xs={12} md={6}>
          <Card>
            <CardHeader title="Perfect Use Cases" />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Customer/User Profiles"
                    secondary="View detailed information without losing context"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Data Tables & Reports"
                    secondary="Large datasets that need more screen space"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Document/Invoice Viewers"
                    secondary="PDFs, contracts, invoices in dedicated window"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Tools & Calculators"
                    secondary="Keep tools accessible while working"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 item xs={12} md={6}>
          <Card>
            <CardHeader title="Implementation Benefits" />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Non-blocking UI"
                    secondary="Main application stays fully interactive"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Better Multitasking"
                    secondary="Users can reference data while working"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Preserved Styling"
                    secondary="All Material-UI themes and styles maintained"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Native Window Controls"
                    secondary="Users can resize, minimize, and position windows"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {activeWindow && (
        <DepWindow closeWindowPortal={closeWindow}>
          {(() => {
            const example = examples.find((ex) => ex.id === activeWindow);
            const Component = example?.component;
            return Component ? <Component /> : null;
          })()}
        </DepWindow>
      )}
    </Box>
  );
};

export default DeepWindowWithMaterialUi;
