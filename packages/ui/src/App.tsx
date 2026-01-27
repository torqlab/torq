import { Router, Route, Switch } from 'wouter';
import HomePage from './pages/HomePage';
import ActivitiesPage from './pages/ActivitiesPage';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/activities" component={ActivitiesPage} />
        <Route>404 - Page Not Found</Route>
      </Switch>
    </Router>
  );
}
