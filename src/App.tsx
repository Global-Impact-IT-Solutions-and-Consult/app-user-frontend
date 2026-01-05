import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";
import { Badge } from "./components/ui/Badge";
import { Toggle } from "./components/ui/Toggle";
import { Card, StatCard } from "./components/ui/Card";
import {
  Plus,
  Search,
  FlaskConical,
  ShieldCheck,
  LayoutGrid,
  CheckCircle2,
  ArrowRight,
  Mail
} from "lucide-react";
import { cn } from "./lib/utils";

function App() {
  const [toggleVal, setToggleVal] = useState(true);

  return (
    <div className="flex min-h-screen bg-surface-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Header Section */}
          <div className="flex items-center justify-between border-b border-surface-200 pb-8">
            <div>
              <h2 className="text-3xl font-bold text-surface-900">Component Gallery</h2>
              <p className="text-surface-400 mt-1">Audit and verification of the UI library.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Export System
              </Button>
              <Button>Create Component</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Buttons Section */}
            <section className="space-y-4">
              <h3 className="font-bold text-surface-900 border-l-4 border-primary-500 pl-3">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button isLoading>Loading</Button>
              </div>
            </section>

            {/* Inputs & Toggles */}
            <section className="space-y-4">
              <h3 className="font-bold text-surface-900 border-l-4 border-primary-500 pl-3">Form Elements</h3>
              <Input label="Business Email Address *" placeholder="name@yourcompany.com" icon={<Mail className="h-4 w-4" />} />
              <Input label="Search Logs" placeholder="Search..." icon={<Search className="h-4 w-4" />} />
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-surface-900">Active Mode</span>
                  <Toggle checked={toggleVal} onToggleChange={setToggleVal} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-surface-900">Live Sync</span>
                  <Toggle />
                </div>
              </div>
            </section>

            {/* Badges */}
            <section className="space-y-4">
              <h3 className="font-bold text-surface-900 border-l-4 border-primary-500 pl-3">Badges</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="warning" icon={<FlaskConical className="h-3 w-3" />}>Test Environment</Badge>
                <Badge variant="success" icon={<FlaskConical className="h-3 w-3" />}>Live Environment</Badge>
                <Badge variant="primary">New Feature</Badge>
                <Badge variant="danger">Error</Badge>
                <Badge variant="gray">Archived</Badge>
              </div>
            </section>

          </div>

          {/* Cards & Stats */}
          <section className="space-y-6">
            <h3 className="font-bold text-surface-900 border-l-4 border-primary-500 pl-3">Dashboard Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={<LayoutGrid className="h-5 w-5" />}
                label="Invoices Processed"
                value="1,247"
                trend={{ value: "12%", isUp: true }}
                subtext="Total processed this month"
              />
              <Card className="col-span-1 md:col-span-2 p-6 bg-primary-50/50 border-primary-100 flex items-center gap-6">
                <div className="h-14 w-14 rounded-lg bg-primary-500 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-surface-900 text-lg">Authenticator App (Recommended)</h4>
                  <p className="text-sm text-surface-400 mt-1 max-w-md">
                    Use apps like Google Authenticator, Microsoft Authenticator, or Authy. Provides the highest level of security.
                  </p>
                </div>
                <Button variant="ghost" size="icon"><ArrowRight className="h-5 w-5" /></Button>
              </Card>
            </div>
          </section>

          {/* Verification Cards */}
          <section className="space-y-6">
            <h3 className="font-bold text-surface-900 border-l-4 border-primary-500 pl-3">Process States</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2].map((i) => (
                <Card key={i} className={cn("p-8 text-center space-y-4", i === 2 && "bg-primary-50/20 border-primary-200")}>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-500">
                    <CheckCircle2 className="h-6 w-6 fill-primary-500 text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-surface-900 text-lg">Validate Invoice</h5>
                    <p className="text-sm text-surface-400">Checking against NRS schema</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

export default App;

