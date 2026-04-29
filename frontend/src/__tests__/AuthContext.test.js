jest.mock('../lib/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
  clearToken: jest.fn(),
  getStoredToken: jest.fn(),
  storeToken: jest.fn(),
}))

import { render, screen, waitFor } from '@testing-library/react'

import { AuthProvider, useAuth } from '../context/AuthContext'
import { api, getStoredToken } from '../lib/api'

function Probe() {
  const { user, loading } = useAuth()
  return <div>{loading ? 'loading' : user?.username || 'anon'}</div>
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('resolves anonymous state without token', async () => {
    getStoredToken.mockReturnValueOnce(null)
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    )
    await waitFor(() => expect(screen.getByText('anon')).toBeInTheDocument())
  })

  it('loads current user when token exists', async () => {
    getStoredToken.mockReturnValueOnce('token')
    api.get.mockResolvedValueOnce({ data: { username: 'alex' } })
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    )
    await waitFor(() => expect(screen.getByText('alex')).toBeInTheDocument())
  })
})
