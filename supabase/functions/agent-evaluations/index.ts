const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const agentUrl = (Deno.env.get('ONFLY_AGENT_API_URL') || '').replace(/\/+$/, '')
    if (!agentUrl) {
      return new Response(JSON.stringify({ error: 'ONFLY_AGENT_API_URL not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const url = new URL(req.url)
    const decision = url.searchParams.get('decision') || ''
    const type = url.searchParams.get('type') || ''
    const page = url.searchParams.get('page') || '1'

    const params = new URLSearchParams()
    if (decision) params.set('decision', decision)
    if (type) params.set('type', type)
    params.set('page', page)

    const response = await fetch(`${agentUrl}/api/agent/evaluations?${params.toString()}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    })

    const responseText = await response.text()
    try {
      const data = JSON.parse(responseText)
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch {
      return new Response(JSON.stringify({ error: 'Agent returned non-JSON response', status: response.status }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  } catch (error) {
    console.error('agent-evaluations error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
