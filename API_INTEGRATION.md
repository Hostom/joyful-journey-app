# Documentação de Integração da API · Fenômeno Imóveis

Esta documentação descreve os padrões, endpoints e especificações de dados para integrar o site da **Fenômeno Imóveis** com sistemas de CRM externos.

A integração está dividida em duas vias principais:
1. **Sincronização de Imóveis (CRM → Site)**: Atualização automática do catálogo de imóveis de luxo no site a partir do inventário no CRM.
2. **Captação de Leads (Site → CRM)**: Registro automático das interações de clientes (envio de formulários) diretamente no CRM.

---

## 1. Diretrizes Gerais e Segurança

### Protocolo e Transporte
- Todas as requisições devem utilizar obrigatoriamente **HTTPS**.
- O formato de intercâmbio de dados é **JSON** (`Content-Type: application/json`).

### Autenticação
Para garantir que apenas o CRM e o site possam trocar dados com segurança, todas as APIs devem implementar autenticação por Token Bearer ou chave de API no cabeçalho HTTP:

```http
Authorization: Bearer <SEU_TOKEN_DE_INTEGRACAO>
```
ou
```http
X-API-Key: <SUA_CHAVE_DE_API>
```

---

## 2. Sincronização de Imóveis (CRM → Site)

Para manter o portfólio de imóveis atualizado, o CRM deve enviar eventos sempre que houver criação, modificação ou exclusão de um imóvel.

### Abordagem Recomendada: Webhook (Push)
O site expõe um endpoint seguro para receber as atualizações do CRM em tempo real.

#### Endpoint do Site:
`POST /api/properties/sync`

#### Cabeçalhos:
```http
Content-Type: application/json
Authorization: Bearer <TOKEN_GERADO_PELO_SITE>
```

#### Payload (JSON):
Corresponde à estrutura interna definida no arquivo [`properties.ts`](file:///c:/Users/Adim/Desktop/joyful-journey-app/src/data/properties.ts).

```json
{
  "slug": "yachthouse-residence-club",
  "name": "Yachthouse Residence Club",
  "location": "Balneário Camboriú",
  "neighborhood": "Barra Sul",
  "type": "Apartamento",
  "price": 38500000,
  "area": 470,
  "bedrooms": 4,
  "suites": 4,
  "parking": 5,
  "description": "Localizado nas torres mais altas residenciais da América Latina...",
  "features": [
    "Vista 270° para o mar",
    "4 suítes com closet",
    "Marina exclusiva"
  ],
  "images": [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
  ]
}
```

### Tabela de Campos do Imóvel

| Campo | Tipo | Obrigatório | Descrição | Exemplo |
| :--- | :--- | :--- | :--- | :--- |
| `slug` | String | **Sim** | Identificador único e amigável para SEO. Apenas letras minúsculas, números e hifens. | `"cobertura-iconic-tower"` |
| `name` | String | **Sim** | Nome comercial do empreendimento ou imóvel. | `"Cobertura Iconic Tower"` |
| `location` | String | **Sim** | Cidade do imóvel. Valores permitidos: `"Balneário Camboriú"`, `"Itapema"`, `"Itajaí"`. | `"Balneário Camboriú"` |
| `neighborhood` | String | **Sim** | Bairro ou localização detalhada. | `"Av. Atlântica · Frente Mar"` |
| `type` | String | **Sim** | Categoria do imóvel. Valores permitidos: `"Apartamento"`, `"Cobertura"`, `"Penthouse"`, `"Casa"`. | `"Cobertura"` |
| `price` | Number | **Sim** | Preço de venda em Reais. Utilize `0` para exibir **"Sob consulta"** no site. | `38500000` |
| `area` | Number | **Sim** | Área útil/privativa em metros quadrados ($m^2$). | `820` |
| `bedrooms` | Number | **Sim** | Quantidade total de dormitórios. | `5` |
| `suites` | Number | **Sim** | Quantidade de suítes inclusas nos dormitórios. | `5` |
| `parking` | Number | **Sim** | Número de vagas de garagem reservadas. | `6` |
| `description` | String | **Sim** | Descrição comercial completa do imóvel. Suporta quebras de linha (`\n`). | `"Cobertura duplex frente-mar..."` |
| `features` | Array | **Sim** | Lista de strings contendo os diferenciais e comodidades do imóvel. | `["Cinema privativo", "Heliponto"]` |
| `images` | Array | **Sim** | Lista de URLs das fotos do imóvel. Recomendado HTTPS e compressão WebP. | `["https://exemplo.com/foto.webp"]` |

> [!NOTE]
> O campo `priceLabel` presente na UI é gerado e formatado dinamicamente pelo frontend com base no valor numérico enviado em `price`.

---

### Remoção de Imóveis (Arquivamento / Venda)
Quando um imóvel for vendido ou removido do catálogo no CRM, o CRM deve enviar uma requisição de exclusão para o site.

#### Endpoint do Site:
`DELETE /api/properties/sync`

#### Payload (JSON):
```json
{
  "slug": "yachthouse-residence-club"
}
```

---

## 3. Captação de Leads (Site → CRM)

Sempre que um visitante preencher um formulário de contato ou interesse no site, o site enviará os dados instantaneamente para o CRM.

### Endpoint do CRM:
`POST https://api.crm-exemplo.com/v1/leads` (A ser fornecido pelo CRM)

### Cabeçalhos:
```http
Content-Type: application/json
Authorization: Bearer <TOKEN_DE_AUTENTICACAO_DO_CRM>
```

### Payload (JSON):
```json
{
  "name": "Gabriel Vasconcelos",
  "email": "gabriel.vasconcelos@email.com",
  "phone": "+5547999998888",
  "message": "Tenho interesse em agendar uma visita para conhecer a cobertura duplex.",
  "interest": {
    "property_slug": "cobertura-iconic-tower",
    "property_name": "Cobertura Iconic Tower"
  },
  "marketing": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "search_balneario_luxo",
    "page_url": "https://fenomenoimoveis.com.br/imoveis/cobertura-iconic-tower"
  }
}
```

### Tabela de Campos do Lead (Envio)

| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `name` | String | **Sim** | Nome completo fornecido pelo usuário. |
| `email` | String | **Sim** | Endereço de e-mail de contato válido. |
| `phone` | String | **Sim** | Telefone de contato formatado com DDD e DDI (formato recomendado E.164). |
| `message` | String | Não | Mensagem personalizada escrita pelo cliente. |
| `interest` | Object | Não | Dados do imóvel que gerou o contato (se aplicável). |
| `interest.property_slug` | String | Não | Slug identificador do imóvel associado. |
| `interest.property_name` | String | Não | Nome legível do imóvel associado. |
| `marketing` | Object | Não | Dados de atração de tráfego para acompanhamento da equipe de marketing. |
| `marketing.utm_source` | String | Não | Origem da visita (ex: `google`, `facebook`, `newsletter`). |
| `marketing.utm_medium` | String | Não | Canal de marketing (ex: `cpc`, `organic`, `social`). |
| `marketing.utm_campaign`| String | Não | Nome da campanha publicitária activa. |
| `marketing.page_url` | String | Não | Link exato da página onde o cadastro foi efetuado. |

---

## 4. Códigos de Retorno e Resiliência

As APIs de ambas as pontas devem responder com os códigos de status HTTP padrão adequados:

| Código HTTP | Significado | Ação Recomendada |
| :--- | :--- | :--- |
| `200 OK` ou `201 Created` | Sucesso completo. | Prosseguir. O dado foi integrado. |
| `400 Bad Request` | Erro de validação. Payload malformado ou campos obrigatórios ausentes. | **Não re-enviar**. Corrigir os dados no sistema de origem antes de tentar novamente. |
| `401 Unauthorized` | Falha de autenticação (token inválido ou ausente). | **Não re-enviar**. Verificar as chaves de segurança configuradas. |
| `429 Too Many Requests` | Limite de taxa excedido (Rate Limit). | Aguardar e re-enviar com política de backoff exponencial. |
| `500 / 502 / 503 / 504` | Erros internos do servidor temporários. | **Re-enviar** utilizando uma fila de retentativas. |

### Política de Retentativas para Webhooks
Em caso de falha de conexão ou erro temporário do servidor (status HTTP `5xx` ou timeout), o sistema de envio deve re-enviar a notificação aplicando uma fila com **Backoff Exponencial com ruído (jitter)** (ex: tentativas após 1 min, 5 min, 30 min, 2h e 6h) antes de descartar a operação ou alertar o administrador.
