# Configuração do N8N para Geração de Relatórios

Este guia explica como configurar o N8N para receber os dados do formulário, gerar relatórios com IA e criar páginas personalizadas para cada usuário.

## Pré-requisitos

1. **N8N instalado e rodando** (cloud ou self-hosted)
2. **Chave de API de IA** (OpenAI, Claude, Gemini, etc.)
3. **Acesso ao N8N** para criar workflows

## Passo 1: Criar Workflow de Criação de Relatório

### 1.1 Webhook de Entrada

1. Adicione um nó **Webhook**
2. Configure:
   - **HTTP Method**: `POST`
   - **Path**: `/create-report`
   - **Response Mode**: "Respond to Webhook"
   - **Response Code**: `200`
3. **Ative o webhook** e copie a URL (ex: `https://seu-n8n.com/webhook/create-report`)

### 1.2 Processar Email e Criar Slug

Adicione um nó **Code** com o seguinte código:

```javascript
// Extrair informações do email
const email = $input.item.json.email;
const [emailName, domain] = email.split('@');
const companyName = domain.split('.')[0];

// Criar slug amigável
const slug = emailName
  .toLowerCase()
  .replace(/[^a-z0-9]/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '') + 
  '-' + 
  domain
    .toLowerCase()
    .replace(/\./g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

return {
  json: {
    ...$input.item.json,
    emailName: emailName,
    companyDomain: domain,
    companyName: companyName,
    slug: slug
  }
};
```

### 1.3 Chamar API de IA

Adicione um nó **HTTP Request**:

**Configuração:**
- **Method**: `POST`
- **URL**: `https://api.openai.com/v1/chat/completions` (ou sua API de IA)
- **Authentication**: Bearer Token
- **Token**: Sua chave de API

**Body (JSON):**
```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "Você é um especialista em stack de IA para empresas. Crie relatórios detalhados e personalizados em HTML, com análise técnica, ROI estimado, curva de aprendizado e plano de implementação."
    },
    {
      "role": "user",
      "content": "Crie um relatório completo de stack de IA em HTML para:\n\nEmail: {{$json.email}}\nEmpresa: {{$json.companyName}}\nÁrea: {{$json.area}}\nCargo: {{$json.cargo}}\nSenioridade: {{$json.senioridade}}/100\nAutonomia: {{$json.autonomia}}/100\nNível Técnico: {{$json.nivelTecnico}}/100\nTarefas: {{$json.tarefas}}\nUso de IA: {{$json.usaIA}}\n\nStack sugerido:\n{{$json.stackRecommendation}}\n\nO relatório deve incluir:\n1. Análise do perfil do usuário\n2. Justificativa técnica de cada ferramenta\n3. ROI estimado por ferramenta\n4. Curva de aprendizado\n5. Plano de implementação passo a passo\n6. Métricas de sucesso\n\nFormate tudo em HTML bonito e profissional."
    }
  ],
  "temperature": 0.7,
  "max_tokens": 4000
}
```

### 1.4 Processar Resposta da IA

Adicione outro nó **Code**:

```javascript
// Extrair conteúdo HTML do relatório gerado pela IA
const aiResponse = $input.item.json.choices[0].message.content;
const reportHTML = aiResponse;

// Preparar dados para salvar
return {
  json: {
    slug: $('Processar Email').item.json.slug,
    email: $('Processar Email').item.json.email,
    companyName: $('Processar Email').item.json.companyName,
    reportHTML: reportHTML,
    originalData: $('Processar Email').item.json,
    createdAt: new Date().toISOString()
  }
};
```

### 1.5 Salvar Relatório

**Opção A: Banco de Dados (Recomendado)**

Adicione um nó **PostgreSQL** (ou MySQL/MongoDB):

- **Operation**: `Insert`
- **Table**: `reports`
- **Columns**:
  - `slug`: `{{$json.slug}}`
  - `email`: `{{$json.email}}`
  - `company_name`: `{{$json.companyName}}`
  - `report_html`: `{{$json.reportHTML}}`
  - `created_at`: `{{$json.createdAt}}`

**Opção B: Google Sheets**

Adicione um nó **Google Sheets** para salvar os dados.

**Opção C: Airtable**

Adicione um nó **Airtable** para salvar os dados.

### 1.6 Responder ao Webhook

Adicione um nó **Respond to Webhook**:

**Response Body:**
```json
{
  "success": true,
  "slug": "{{$json.slug}}",
  "url": "https://seu-site.com/relatorio.html?slug={{$json.slug}}"
}
```

## Passo 2: Criar Workflow para Buscar Relatórios

### 2.1 Webhook de Leitura

1. Adicione um nó **Webhook**
2. Configure:
   - **HTTP Method**: `GET`
   - **Path**: `/get-report/:slug`
   - **Response Mode**: "Respond to Webhook"

### 2.2 Buscar Relatório

Adicione um nó **PostgreSQL** (ou seu banco):

- **Operation**: `Execute Query`
- **Query**: 
```sql
SELECT report_html FROM reports WHERE slug = $1
```
- **Parameters**: `{{$json.slug}}`

### 2.3 Retornar HTML

Adicione um nó **Respond to Webhook**:

**Response Body:**
```json
{
  "reportHTML": "{{$json.report_html}}"
}
```

## Passo 3: Configurar URLs no Frontend

No arquivo `script.js`, atualize a URL do webhook:

```javascript
// Linha ~1095
const N8N_WEBHOOK_URL = 'https://SEU-N8N-URL.com/webhook/create-report';
```

No arquivo `relatorio.html`, atualize a URL de leitura:

```javascript
// Linha ~60
const N8N_GET_REPORT_URL = `https://SEU-N8N-URL.com/webhook/get-report/${slug}`;
```

## Passo 4: Configurar Variáveis de Ambiente no N8N

1. Vá em **Settings** > **Variables**
2. Adicione:
   - `OPENAI_API_KEY`: Sua chave da OpenAI
   - `DATABASE_URL`: URL do seu banco de dados (se usar)

## Passo 5: Testar

1. Preencha o formulário no site
2. Insira um email
3. Verifique se o workflow do N8N é executado
4. Verifique se o relatório é gerado e salvo
5. Acesse `relatorio.html?slug=seu-slug` para ver o resultado

## Estrutura do Banco de Dados (PostgreSQL)

```sql
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    report_html TEXT NOT NULL,
    original_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_slug ON reports(slug);
```

## Troubleshooting

1. **Erro 404 no webhook**: Verifique se o workflow está ativo no N8N
2. **Erro de autenticação**: Verifique se a chave de API está correta
3. **Relatório não aparece**: Verifique se o slug está sendo salvo corretamente
4. **Timeout**: Aumente o timeout do webhook no N8N

## Próximos Passos

- Adicionar cache para relatórios já gerados
- Implementar autenticação por email
- Adicionar analytics de visualização
- Enviar email com link do relatório

