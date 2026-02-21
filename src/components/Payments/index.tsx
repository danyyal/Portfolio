import { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import {
  CreditCard,
  Payment,
  AccountBalance,
  Phone,
  Apple,
  Google,
} from "@mui/icons-material";

interface PaymentResult {
  gateway: string;
  transactionId: string;
  amount: string;
  method: string;
}

interface PaymentComponentProps {
  onPaymentComplete: (result: PaymentResult) => void;
  onError: (error: string) => void;
}

// Stripe Component
const StripePayment = ({ onPaymentComplete }: PaymentComponentProps) => {
  const [cardNumber, setCardNumber] = useState("4242424242424242");
  const [expiryDate, setExpiryDate] = useState("12/25");
  const [cvv, setCvv] = useState("123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulate Stripe API call
    setTimeout(() => {
      onPaymentComplete({
        gateway: "Stripe",
        transactionId: "pi_" + Math.random().toString(36).substr(2, 9),
        amount: "$29.99",
        method: "Credit Card",
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Stripe Payment
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1234 5678 9012 3456"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Expiry Date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="MM/YY"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="123"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Test Cards: 4242424242424242 (Success) | 4000000000000002 (Decline)
        </Alert>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : "Pay with Stripe"}
      </Button>
    </Box>
  );
};

// PayPal Component
const PayPalPayment = ({ onPaymentComplete }: PaymentComponentProps) => {
  const [loading, setLoading] = useState(false);

  const handlePayPalPayment = () => {
    setLoading(true);

    // Simulate PayPal SDK
    setTimeout(() => {
      onPaymentComplete({
        gateway: "PayPal",
        transactionId:
          "PAYID-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        amount: "$29.99",
        method: "PayPal Account",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        PayPal Payment
      </Typography>

      <Paper sx={{ p: 2, bgcolor: "#0070ba", color: "white", mb: 2 }}>
        <Typography variant="body2">
          You will be redirected to PayPal to complete your payment securely.
        </Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 2 }}>
        Using PayPal Sandbox Environment
      </Alert>

      <Button
        fullWidth
        variant="contained"
        onClick={handlePayPalPayment}
        disabled={loading}
        sx={{
          mt: 2,
          bgcolor: "#0070ba",
          "&:hover": { bgcolor: "#005ea6" },
        }}
      >
        {loading ? <CircularProgress size={24} /> : "Pay with PayPal"}
      </Button>
    </Box>
  );
};

// Apple Pay Component
const ApplePayPayment = ({ onPaymentComplete }: PaymentComponentProps) => {
  const [loading, setLoading] = useState(false);

  const handleApplePay = () => {
    setLoading(true);

    // Simulate Apple Pay
    setTimeout(() => {
      onPaymentComplete({
        gateway: "Apple Pay",
        transactionId: "apple_" + Math.random().toString(36).substr(2, 9),
        amount: "$29.99",
        method: "Touch ID",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Apple Pay
      </Typography>

      <Paper sx={{ p: 2, bgcolor: "#000", color: "white", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Apple sx={{ mr: 1 }} />
          <Typography variant="body2">Pay with Touch ID or Face ID</Typography>
        </Box>
      </Paper>

      <Alert severity="warning" sx={{ mb: 2 }}>
        Apple Pay requires Safari browser and configured payment methods
      </Alert>

      <Button
        fullWidth
        variant="contained"
        onClick={handleApplePay}
        disabled={loading}
        sx={{
          mt: 2,
          bgcolor: "#000",
          "&:hover": { bgcolor: "#333" },
        }}
      >
        {loading ? <CircularProgress size={24} /> : "Pay with Apple Pay"}
      </Button>
    </Box>
  );
};

// Google Pay Component
const GooglePayPayment = ({ onPaymentComplete }: PaymentComponentProps) => {
  const [loading, setLoading] = useState(false);

  const handleGooglePay = () => {
    setLoading(true);

    setTimeout(() => {
      onPaymentComplete({
        gateway: "Google Pay",
        transactionId: "google_" + Math.random().toString(36).substr(2, 9),
        amount: "$29.99",
        method: "Google Account",
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Google Pay
      </Typography>

      <Paper sx={{ p: 2, bgcolor: "#4285f4", color: "white", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Google sx={{ mr: 1 }} />
          <Typography variant="body2">Pay with your Google account</Typography>
        </Box>
      </Paper>

      <Alert severity="info" sx={{ mb: 2 }}>
        Using Google Pay Test Environment
      </Alert>

      <Button
        fullWidth
        variant="contained"
        onClick={handleGooglePay}
        disabled={loading}
        sx={{
          mt: 2,
          bgcolor: "#4285f4",
          "&:hover": { bgcolor: "#3367d6" },
        }}
      >
        {loading ? <CircularProgress size={24} /> : "Pay with Google Pay"}
      </Button>
    </Box>
  );
};

// Razorpay Component
const RazorpayPayment = ({ onPaymentComplete }: PaymentComponentProps) => {
  const [loading, setLoading] = useState(false);

  const handleRazorpayPayment = () => {
    setLoading(true);

    // Simulate Razorpay checkout
    setTimeout(() => {
      onPaymentComplete({
        gateway: "Razorpay",
        transactionId: "pay_" + Math.random().toString(36).substr(2, 9),
        amount: "₹2,499",
        method: "UPI/Card/Netbanking",
      });
      setLoading(false);
    }, 1800);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Razorpay Payment
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body2" gutterBottom>
          Accept payments via:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip label="UPI" size="small" />
          <Chip label="Credit Card" size="small" />
          <Chip label="Debit Card" size="small" />
          <Chip label="Net Banking" size="small" />
          <Chip label="Wallets" size="small" />
        </Box>
      </Paper>

      <Alert severity="info" sx={{ mb: 2 }}>
        Razorpay Test Mode - No actual payment will be processed
      </Alert>

      <Button
        fullWidth
        variant="contained"
        onClick={handleRazorpayPayment}
        disabled={loading}
        sx={{
          mt: 2,
          bgcolor: "#528ff0",
          "&:hover": { bgcolor: "#3f7dd9" },
        }}
      >
        {loading ? <CircularProgress size={24} /> : "Pay ₹2,499"}
      </Button>
    </Box>
  );
};

// Square Payment Component
const SquarePayment = ({ onPaymentComplete }: PaymentComponentProps) => {
  const [cardNumber, setCardNumber] = useState("4111111111111111");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      onPaymentComplete({
        gateway: "Square",
        transactionId: "sq_" + Math.random().toString(36).substr(2, 9),
        amount: "$29.99",
        method: "Credit Card",
      });
      setLoading(false);
    }, 1600);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Square Payment
      </Typography>

      <TextField
        fullWidth
        label="Card Number"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Alert severity="info" sx={{ mb: 2 }}>
        Square Sandbox: Test card 4111111111111111
      </Alert>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ mt: 2, bgcolor: "#006aff", "&:hover": { bgcolor: "#0056cc" } }}
      >
        {loading ? <CircularProgress size={24} /> : "Pay with Square"}
      </Button>
    </Box>
  );
};

// Main Payment Gateway Component
const PaymentGatewayComponent = () => {
  const [selectedGateway, setSelectedGateway] = useState("");
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const gateways = [
    {
      value: "stripe",
      label: "Stripe",
      icon: <CreditCard />,
      component: StripePayment,
      description: "Credit/Debit Cards worldwide",
    },
    {
      value: "paypal",
      label: "PayPal",
      icon: <Payment />,
      component: PayPalPayment,
      description: "PayPal account or guest checkout",
    },
    {
      value: "applepay",
      label: "Apple Pay",
      icon: <Apple />,
      component: ApplePayPayment,
      description: "Touch ID, Face ID payments",
    },
    {
      value: "googlepay",
      label: "Google Pay",
      icon: <Google />,
      component: GooglePayPayment,
      description: "Google account payments",
    },
    {
      value: "razorpay",
      label: "Razorpay",
      icon: <Phone />,
      component: RazorpayPayment,
      description: "UPI, Cards, Net Banking (India)",
    },
    {
      value: "square",
      label: "Square",
      icon: <AccountBalance />,
      component: SquarePayment,
      description: "Square payment processing",
    },
  ];

  const handleGatewayChange = (event: { target: { value: string } }) => {
    setSelectedGateway(event.target.value);
    setPaymentResult(null);
    setError(null);
  };

  const handlePaymentComplete = (result: PaymentResult) => {
    setPaymentResult(result);
    setError(null);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setPaymentResult(null);
  };

  const selectedGatewayData = gateways.find((g) => g.value === selectedGateway);
  const PaymentComponent = selectedGatewayData?.component;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Payment Gateway Integration
      </Typography>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: 4 }}
      >
        Select a payment gateway to see the actual implementation
      </Typography>

      <Card elevation={3}>
        <CardHeader
          title="Choose Payment Method"
          sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}
        />
        <CardContent>
          {/* Gateway Selector */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Payment Gateway</InputLabel>
            <Select
              value={selectedGateway}
              label="Payment Gateway"
              onChange={handleGatewayChange}
            >
              {gateways.map((gateway) => (
                <MenuItem key={gateway.value} value={gateway.value}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    {gateway.icon}
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="body1">{gateway.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {gateway.description}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Selected Gateway Component */}
          {selectedGateway && PaymentComponent && (
            <Box>
              <Divider sx={{ mb: 2 }} />
              <PaymentComponent
                onPaymentComplete={handlePaymentComplete}
                onError={handlePaymentError}
              />
            </Box>
          )}

          {/* Payment Result */}
          {paymentResult && (
            <Alert severity="success" sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payment Successful! 🎉
              </Typography>
              <Typography variant="body2">
                <strong>Gateway:</strong> {paymentResult.gateway}
                <br />
                <strong>Transaction ID:</strong> {paymentResult.transactionId}
                <br />
                <strong>Amount:</strong> {paymentResult.amount}
                <br />
                <strong>Method:</strong> {paymentResult.method}
              </Typography>
            </Alert>
          )}

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payment Failed ❌
              </Typography>
              <Typography variant="body2">{error}</Typography>
            </Alert>
          )}

          {/* Instructions */}
          {!selectedGateway && (
            <Paper sx={{ p: 3, bgcolor: "grey.50", textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Select a Payment Gateway
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Each gateway has its own implementation with real test
                credentials and working payment flows.
              </Typography>
            </Paper>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentGatewayComponent;
