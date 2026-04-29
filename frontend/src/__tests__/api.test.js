import { clearToken, getStoredToken, storeToken } from '../lib/api'

describe('token storage helpers', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('stores and reads token', () => {
    storeToken('abc')
    expect(getStoredToken()).toBe('abc')
  })

  it('clears token', () => {
    storeToken('abc')
    clearToken()
    expect(getStoredToken()).toBeNull()
  })
})
