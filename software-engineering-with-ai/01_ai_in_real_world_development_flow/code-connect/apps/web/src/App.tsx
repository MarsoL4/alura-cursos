import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { FeedPage } from './components/pages/FeedPage/FeedPage'
import { LoginPage } from './components/pages/LoginPage/LoginPage'
import { PublishPage } from './components/pages/PublishPage/PublishPage'
import { SignupPage } from './components/pages/SignupPage/SignupPage'
import { FeedLayout } from './components/templates/FeedLayout/FeedLayout'
import { PrivateRoute } from './components/templates/PrivateRoute/PrivateRoute'

function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />} />

      {/* Layout compartilhado entre feed e detalhes */}
      <Route element={<FeedLayout />}>
        <Route path="/" element={<FeedPage />} />
        <Route
          path="/publicar"
          element={
            <PrivateRoute>
              <PublishPage />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
