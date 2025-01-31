/**
 * Created by Jacob Xie on 2/1/2021
 */

import { Route, Switch } from "react-router-dom"

import Gallery from "./Gallery"
import Configuration from "./Configuration"
import Dataset from "./Dataset"
import Dashboard from "./Dashboard"
import DashboardTemplate from "./DashboardTemplate"

export default () => {

  return (
    <Switch>
      <Route path="/gallery/" component={Gallery} exact />
      <Route path="/gallery/configuration" component={Configuration} />
      <Route path="/gallery/dashboardTemplate" component={DashboardTemplate} />
      <Route path="/gallery/dataset" component={Dataset} />
      <Route path="/gallery/dashboard" component={Dashboard} />
    </Switch>
  )
}

