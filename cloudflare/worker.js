const LEVEL_BLUEPRINTS = [
  'fortified island maze', 'crash-site fire corridor', 'patrolled city streets',
  'checkpoint territory', 'flooding subway tunnels', 'hostage tower extraction',
  'arena gate puzzle', 'night pursuit', 'damaged bridge crossing', 'final checkpoint'
];

const headers = {
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'cache-control': 'public, max-age=300'
};

function json(value, status = 200) {
  return new Response(JSON.stringify(value), { status, headers });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return json({ ok: true, service: 'snakes-revenge-content', version: 1 });
    }

    if (url.pathname === '/levels') {
      return json({ version: 1, levels: LEVEL_BLUEPRINTS.map((name, index) => ({ id: index + 1, name })) });
    }

    if (url.pathname === '/ai/scenario' && request.method === 'POST') {
      const input = await request.json().catch(() => ({}));
      const level = Math.min(10, Math.max(1, Number(input.level) || 1));
      const prompt = `Create one family-safe tactical escape decision for level ${level}, ${LEVEL_BLUEPRINTS[level - 1]}. ` +
        'Teach observation, navigation, teamwork, or hazard awareness. Return compact JSON with q, opts (four strings), correct (0-3), and hint. ' +
        'No trivia, gore, weapons instruction, copyrighted dialogue, or real-person likenesses.';
      const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', {
        messages: [{ role: 'system', content: 'Return valid JSON only.' }, { role: 'user', content: prompt }],
        response_format: { type: 'json_object' }, max_tokens: 350
      });
      const raw = result.response || result;
      let scenario = raw;
      if (typeof raw === 'string') {
        try { scenario = JSON.parse(raw); } catch { scenario = { q: raw }; }
      }
      return json({ version: 1, level, generated: true, scenario }, 200);
    }

    return json({ error: 'not_found', routes: ['/health', '/levels', '/ai/scenario'] }, 404);
  }
};
