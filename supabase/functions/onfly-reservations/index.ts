import { corsHeaders } from '@supabase/supabase-js/cors'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const page = url.searchParams.get('page') || '1'
    const perPage = url.searchParams.get('perPage') || '50'

    const apiToken = Deno.env.get('ONFLY_API_TOKEN')
    const userId = Deno.env.get('ONFLY_USER_ID')

    if (!apiToken || !userId) {
      return new Response(JSON.stringify({ error: 'Missing API configuration' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const apiUrl = `https://gateway-v3.onfly.com/foundation-hub/approval/entity/legacy?userId=${userId}&includes=solicitor,solicitor.group,costCenter,permissions,history,history.changedBy&page=${page}&perPage=${perPage}&types[]=2&types[]=3&types[]=5&types[]=6&viewAll=false&categories[]=1&retry=2`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'authorization': `Bearer ${apiToken}`,
        'origin': 'https://app.onfly.com',
        'referer': 'https://app.onfly.com/',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(JSON.stringify({ error: 'API request failed', status: response.status, details: errorText }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
