import { useState, type FormEvent } from "react";
import { Container } from "react-bootstrap";
import {
  HiOutlineSparkles,
  HiCheck,
  HiOutlineTrash,
  HiArrowRight,
} from "react-icons/hi";
import Particle from "../Particle";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import "./ui-lab.css";

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <section className="mb-12 text-left">
    <h2
      className="mb-1 text-xl font-semibold"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {title}
    </h2>
    <p className="mb-5 text-sm" style={{ color: "var(--muted-foreground)" }}>
      {description}
    </p>
    {children}
  </section>
);

function SignupCard() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) setSubmitted(true);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          A working form built from Input + Button primitives.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <p
            className="flex items-center gap-2 text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            <HiCheck /> Thanks! Check {email} for a confirmation link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label
              className="text-sm font-medium"
              htmlFor="shadcn-email"
              style={{ color: "var(--foreground)" }}
            >
              Email
            </label>
            <Input
              id="shadcn-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="mt-2">
              Sign up <HiArrowRight />
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          No emails are actually sent — demo only.
        </p>
      </CardFooter>
    </Card>
  );
}

function ShadcnShowcase() {
  return (
    <Container fluid className="project-section ui-lab">
      <Particle />
      <Container style={{ maxWidth: 960 }}>
        <div className="section-header" style={{ marginBottom: "2.5rem" }}>
          <h1 className="project-heading">
            <span className="section-title">shadcn/ui</span>{" "}
            <strong className="purple-glow">Component Lab</strong>
          </h1>
          <p className="section-subtitle">
            Hand-rolled shadcn-style primitives — class-variance-authority +
            tailwind-merge + Radix Slot — themed with the site's Aurora tokens
            and fully dark/light aware.
          </p>
        </div>

        <Section
          title="Buttons"
          description="Six variants, four sizes, composable with any icon set."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button>
              <HiOutlineSparkles /> Default
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">
              <HiOutlineTrash /> Delete
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Sparkles">
              <HiOutlineSparkles />
            </Button>
            <Button disabled>Disabled</Button>
          </div>
        </Section>

        <Section
          title="Badges"
          description="Status and metadata chips in four variants."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge>
              <HiCheck /> Verified
            </Badge>
          </div>
        </Section>

        <Section
          title="Cards & forms"
          description="Card composition with a functional controlled form."
        >
          <div className="flex flex-wrap gap-6">
            <SignupCard />
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Pro plan <Badge variant="secondary">Popular</Badge>
                </CardTitle>
                <CardDescription>
                  Everything you need to ship faster.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p
                  className="mb-3 text-3xl font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  $24
                  <span
                    className="text-sm font-normal"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    /month
                  </span>
                </p>
                <ul
                  className="flex flex-col gap-2 text-sm"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {[
                    "Unlimited projects",
                    "Priority support",
                    "Custom domains",
                    "Analytics dashboard",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <HiCheck style={{ color: "var(--primary)" }} /> {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get started</Button>
              </CardFooter>
            </Card>
          </div>
        </Section>
      </Container>
    </Container>
  );
}

export default ShadcnShowcase;
