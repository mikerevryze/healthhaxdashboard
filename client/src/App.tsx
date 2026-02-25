import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import StressTest from "@/pages/stress-test";

function Router() {
  return (
    <Switch>
      <Route path="/" component={StressTest} />
    </Switch>
  );
}

function App() {
  return (
    <div className="dark">
      <Router />
      <Toaster />
    </div>
  );
}

export default App;
