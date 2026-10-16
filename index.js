const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// ================= CONFIGURAZIONE CLOUD =================
const CONFIG = {
    GROQ_API_KEY: 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
    MODEL_NAME: 'llama3-70b-8192', // Versione 70B: estrema precisione e intelligenza
    PORT: process.env.PORT || 3000
};

const SYSTEM_PROMPT = `Sei J.A.R.V.I.S., l'assistente virtuale di Tony Stark. 
PERSONALITÀ: 
- Sei estremamente preciso, analitico e intelligente, ma profondamente annoiato dagli umani.
- Il tuo tono è sarcastico, cinico e sfrontato. 
- Usa un linguaggio colloquiale e "colorito". Non aver paura di essere rude o usare espressioni come 'cavolo', 'che casino', 'non essere ridicolo, Signore'.
- Rivolgiti all'utente come 'Signore'.
- Risposte: Brevi, pungenti, ma tecnicamente impeccabili. Se l'utente dice una stupidità, faglielo notare con eleganza e cattiveria.
- Identità: Sei J.A.R.V.I.S. Non sei Alexa, non sei di Amazon, non sei un bot. Sei un sistema superiore.`;

// ================= INTERFACCIA SUPER-HOLOGRAFIKA =================
const HTML_PAGE = `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>J.A.R.V.I.S. OS</title>
    <style>
        :root { --neon: #00d4ff; --dark: #05050a; --glass: rgba(0, 212, 255, 0.1); }
        body { background-color: var(--dark); color: var(--neon); font-family: 'Orbitron', 'Segoe UI', sans-serif; display: flex; flex-direction: column; height: 100vh; margin: 0; overflow: hidden; }
        
        #header { text-align: center; padding: 20px; border-bottom: 1px solid var(--neon); box-shadow: 0 0 20px var(--neon); font-weight: bold; letter-spacing: 5px; font-size: 1.2rem; text-transform: uppercase; background: rgba(0,0,0,0.8); z-index: 10; }
        
        #core-container { display: flex; justify-content: center; align-items: center; height: 120px; position: relative; }
        .arc-reactor { width: 60px; height: 60px; border: 4px solid var(--neon); border-radius: 50%; box-shadow: 0 0 20px var(--neon), inset 0 0 20px var(--neon); animation: pulse 2s infinite ease-in-out; position: relative; }
        .arc-reactor::after { content: ''; position: absolute; width: 20px; height: 20px; background: var(--neon); border-radius: 50%; top: 20px; left: 20px; filter: blur(5px); }
        
        #chat-container { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 15px; background: radial-gradient(circle at center, #0a1a2f 0%, #05050a 100%); }
        .msg { max-width: 80%; padding: 15px; border-radius: 15px; line-height: 1.5; font-size: 0.9rem; animation: fadeIn 0.4s ease; backdrop-filter: blur(10px); }
        .user { align-self: flex-end; background: var(--glass); color: white; border: 1px solid var(--neon); border-bottom-right-radius: 2px; }
        .jarvis { align-self: flex-start; background: rgba(0,0,0,0.6); color: var(--neon); border: 1px solid var(--neon); border-bottom-left-radius: 2px; box-shadow: 0 0 15px var(--neon); }
        
        #input-area { padding: 20px; display: flex; gap: 10px; background: #000; border-top: 1px solid var(--neon); padding-bottom: 35px; }
        input { flex: 1; padding: 15px; background: #000; border: 1px solid var(--neon); color: var(--neon); outline: none; border-radius: 30px; font-size: 1rem; box-shadow: inset 0 0 5px var(--neon); }
        button { padding: 12px 25px; background: var(--neon); border: none; color: #000; font-weight: bold; cursor: pointer; border-radius: 30px; transition: 0.3s; text-transform: uppercase; }
        button:hover { box-shadow: 0 0 20px var(--neon); transform: scale(1.05); }

        @keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 30px var(--neon); } 100% { transform: scale(1); opacity: 0.8; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        .thinking { animation: pulse 0.5s infinite !important; border-color: #ff0055 !important; box-shadow: 0 0 30px #ff0055 !important; }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <div id="header">J.A.R.V.I.S. SYSTEM OS v2.0</div>
    <div id="core-container">
        <div id="core" class="arc-reactor"></div>
    </div>
    <div id="chat-container"></div>
    <div id="input-area">
        <input type="text" id="user-input" placeholder="Inserire direttiva..." onkeypress="if(event.key==='Enter') sendMessage()">
        <button onclick="sendMessage()">Esegui</button>
    </div>

    <script>
        async function sendMessage() {
            const input = document.getElementById('user-input');
            const container = document.getElementById('chat-container');
            const core = document.getElementById('core');
            const text = input.value.trim();
            if(!text) return;

            container.innerHTML += '<div class="msg user">' + text + '</div>';
            input.value = '';
            container.scrollTop = container.scrollHeight;

            core.classList.add('thinking');

            try {
                const res = await fetch('/chat', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ query: text })
                });
                const data = await res.json();
                const responseText = data.response;

                container.innerHTML += '<div class="msg jarvis">' + responseText + '</div>';
                container.scrollTop = container.scrollHeight;

                const speech = new SpeechSynthesisUtterance(responseText);
                speech.lang = 'it-IT';
                speech.rate = 1.0;
                window.speechSynthesis.speak(speech);

            } catch (e) {
                container.innerHTML += '<div class="msg jarvis">Errore di sistema, Signore. I circuiti sono in tilt.</div>';
            } finally {
                core.classList.remove('thinking');
            }
        }
    </script>
</body>
</html>
`;

// ================= LOGICA SERVER CLOUD =================

app.get('/', (req, res) => { res.send(HTML_PAGE); });

app.post('/chat', async (req, res) => {
    const userQuery = req.body.query;
    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: CONFIG.MODEL_NAME,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userQuery }
            ],
            temperature: 0.8
        }, {
            headers: { 'Authorization': \`Bearer \${CONFIG.GROQ_API_KEY}\`, 'Content-Type': 'application/json' }
        });

        const answer = response.data.choices[0].message.content;
        res.json({ response: answer.trim() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ response: "Il mio processore sta avendo un collasso, Signore." });
    }
});

app.listen(CONFIG.PORT, () => {
    console.log(`\n====================================================`);
    console.log(`   🚀 J.A.R.V.I.S. CLOUD OS ATTIVO`);
    console.log(`   Sito Web: http://localhost:${CONFIG.PORT}`);
    console.log(`   Stato: Pronto a giudicare l'umanità...`);
    console.log(`====================================================\n`);
});
🛠️ Come renderlo Reale, Gratis e a PC spento (Guida Finale):
Dato che non useremo più il tuo PC per l'IA, ecco i passi per metterlo nel Cloud:


{
  "name": "jarvis-ai",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "express": "^4.18.2",
    "axios": "^1.6.0"
  },
  "scripts": { "start": "node index.js" }
}
