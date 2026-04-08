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

    const url = new URL(req.url)
    const testPath = url.searchParams.get('path') || '/api/agent/api-logs'
    const targetUrl = `${agentUrl}${testPath}`

    console.log('[DEBUG] ONFLY_AGENT_API_URL:', agentUrl)
    console.log('[DEBUG] Target URL:', targetUrl)

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    })

    const responseText = await response.text()
    console.log('[DEBUG] Response status:', response.status)
    console.log('[DEBUG] Response:', responseText.substring(0, 500))

    try {
      const data = JSON.parse(responseText)
      return new Response(JSON.stringify({ 
        debug: { urlCalled: targetUrl, status: response.status },
        data 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch {
      return new Response(JSON.stringify({ 
        debug: { urlCalled: targetUrl, status: response.status },
        error: 'Non-JSON response',
        preview: responseText.substring(0, 300)
      }), {
        status: 200,
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
