import React, { Suspense } from 'react'

// ** Router Import
import Router from './router/Router'

const App = () => {
  console.log(process.env.REACT_APP_DOMAIN_TEMPLATE_REPORT)
  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  )
}

export default App
