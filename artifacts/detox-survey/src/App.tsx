import { Switch, Route, Router as WouterRouter } from "wouter";
import Survey from "@/pages/Survey";
import Results from "@/pages/Results";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Survey} />
      <Route path="/results" component={Results} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default App;
