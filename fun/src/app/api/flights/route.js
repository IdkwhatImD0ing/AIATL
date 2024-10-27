// app/api/flights/route.js

import {NextResponse} from 'next/server'
import {getJson} from 'serpapi'

export async function GET(request) {
  const {searchParams} = new URL(request.url)
  const departureId = searchParams.get('departure_id') || 'PEK' // Default to PEK
  const arrivalId = searchParams.get('arrival_id') || 'AUS' // Default to AUS
  const outboundDate = searchParams.get('outbound_date') || '2024-10-27'
  const returnDate = searchParams.get('return_date') || '2024-11-02'
  const currency = searchParams.get('currency') || 'USD'
  const hl = searchParams.get('hl') || 'en'

  const apiKey = process.env.SERPAPI_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      {error: 'SerpAPI API key is not configured.'},
      {status: 500},
    )
  }

  try {
    const json = await new Promise((resolve, reject) => {
      getJson(
        {
          engine: 'google_flights',
          departure_id: departureId,
          arrival_id: arrivalId,
          outbound_date: outboundDate,
          return_date: returnDate,
          currency: currency,
          hl: hl,
          api_key: apiKey,
        },
        (result) => {
          if (result.error) {
            reject(result.error)
          } else {
            resolve(result)
          }
        },
      )
    })

    return NextResponse.json(json)
  } catch (error) {
    console.error('Error fetching data from SerpAPI:', error)
    return NextResponse.json(
      {error: 'Failed to fetch flight data.'},
      {status: 500},
    )
  }
}
