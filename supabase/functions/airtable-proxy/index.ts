const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/airtable'

const BodySchema = z.object({
  action: z.enum(['list', 'update']),
  table: z.string().min(1),
  baseId: z.string().min(1),
  recordId: z.string().optional(),
  fields: z.record(z.any()).optional(),
  sort: z.array(z.object({ field: z.string(), direction: z.enum(['asc', 'desc']) })).optional(),
  filterByFormula: z.string().optional(),
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY')
  if (!AIRTABLE_API_KEY) {
    return new Response(JSON.stringify({ error: 'AIRTABLE_API_KEY not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { action, table, baseId, recordId, fields, sort, filterByFormula } = parsed.data
    const headers = {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'X-Connection-Api-Key': AIRTABLE_API_KEY,
      'Content-Type': 'application/json',
    }

    const encodedTable = encodeURIComponent(table)

    if (action === 'list') {
      const params = new URLSearchParams()
      if (filterByFormula) params.set('filterByFormula', filterByFormula)
      if (sort) {
        sort.forEach((s, i) => {
          params.set(`sort[${i}][field]`, s.field)
          params.set(`sort[${i}][direction]`, s.direction)
        })
      }
      const url = `${GATEWAY_URL}/v0/${baseId}/${encodedTable}?${params.toString()}`
      const resp = await fetch(url, { headers })
      const data = await resp.json()
      if (!resp.ok) throw new Error(`Airtable list failed [${resp.status}]: ${JSON.stringify(data)}`)
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'update' && recordId && fields) {
      const url = `${GATEWAY_URL}/v0/${baseId}/${encodedTable}/${recordId}`
      const resp = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ fields }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(`Airtable update failed [${resp.status}]: ${JSON.stringify(data)}`)
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid action or missing params' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    console.error('Airtable proxy error:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
