const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const agentUrl = Deno.env.get('ONFLY_AGENT_API_URL')
    if (!agentUrl) {
      return new Response(JSON.stringify({ error: 'ONFLY_AGENT_API_URL not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const targetUrl = `${agentUrl}/api/agent/api-logs`
    console.log('Calling agent URL:', targetUrl)

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    })

    const responseText = await response.text()
    console.log('Agent response status:', response.status)
    console.log('Agent response body (first 500 chars):', responseText.substring(0, 500))

    // Try to parse as JSON
    try {
      const data = JSON.parse(responseText)
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch {
      return new Response(JSON.stringify({ 
        error: 'Agent returned non-JSON response', 
        status: response.status,
        urlCalled: targetUrl,
        preview: responseText.substring(0, 200)
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  } catch (error) {
    console.error('agent-api-logs error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
