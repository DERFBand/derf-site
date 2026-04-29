import { api } from './api'

export function fetchHomeContent(lang) {
  return api.get('/api/v1/content/home', { params: { lang } }).then((response) => response.data)
}

export function fetchMediaList(params = {}) {
  return api.get('/api/v1/media/list', { params }).then((response) => response.data || [])
}

export function fetchReleases(lang) {
  return api.get('/api/v1/content/releases', { params: { lang } }).then((response) => response.data || [])
}

export function fetchPressItems(lang) {
  return api.get('/api/v1/content/press', { params: { lang } }).then((response) => response.data || [])
}

export function fetchEvents(lang) {
  return api.get('/api/v1/events', { params: { lang } }).then((response) => response.data || [])
}

export function fetchSiteLinks() {
  return api.get('/api/v1/content/links').then((response) => response.data || [])
}

export function fetchSiteSettings(lang) {
  return api.get('/api/v1/content/settings', { params: { lang } }).then((response) => response.data?.values || {})
}
