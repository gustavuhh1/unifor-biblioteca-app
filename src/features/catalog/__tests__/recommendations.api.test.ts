import { apiRequest } from '@/shared/api/client'
import { getRecommendations } from '../api/recommendations.api'

jest.mock('@/shared/api/client', () => ({ apiRequest: jest.fn() }))

describe('getRecommendations (RF-ASS-03)', () => {
  it('pede os recomendados em GET /me/recommendations', async () => {
    const response = {
      reasonText: 'Pelo que você leu',
      items: [],
      generatedAt: '2026-10-27T12:00:00.000Z',
      validUntil: '2026-10-27T13:00:00.000Z',
    }
    jest.mocked(apiRequest).mockResolvedValueOnce(response)

    await expect(getRecommendations()).resolves.toEqual(response)
    expect(apiRequest).toHaveBeenCalledWith('/me/recommendations')
  })
})
