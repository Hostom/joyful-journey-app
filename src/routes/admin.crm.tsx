import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";

// ─── Server Functions ────────────────────────────────────────────────────────

/** Retorna as configurações de CRM do ambiente (apenas no servidor). */
const getCrmSettings = createServerFn({ method: "GET" }).handler(async () => {
  return {
    crmLeadsApiUrl: process.env.CRM_LEADS_API_URL ?? "",
    siteToCrmApiKey: process.env.SITE_TO_CRM_API_KEY ?? "",
    crmToSiteBearerToken: process.env.CRM_TO_SITE_BEARER_TOKEN ?? "",
  };
});

/** Valida se a chave API fornecida confere com a chave do ambiente. */
const validateApiKey = createServerFn({ method: "GET" })
  .inputValidator((key: string) => key)
  .handler(async ({ data: key }) => {
    const expected = process.env.SITE_TO_CRM_API_KEY ?? "";
    if (!expected || key !== expected) return { valid: false };
    return { valid: true };
  });

// ─── Rota ───────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/admin/crm")({
  head: () => ({
    meta: [
      { title: "Configurações CRM · Fenômeno Imóveis" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CrmSettingsPage,
});

// ─── Tipos ───────────────────────────────────────────────────────────────────

type Settings = {
  crmLeadsApiUrl: string;
  siteToCrmApiKey: string;
  crmToSiteBearerToken: string;
};

type Tab = "leads" | "imoveis" | "tokens";

// ─── Componente Principal ────────────────────────────────────────────────────

function CrmSettingsPage() {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("leads");
  const [copied, setCopied] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      setAuthError("Por favor, insira a Chave API do site.");
      return;
    }
    setIsAuthenticating(true);
    setAuthError("");
    try {
      const result = await validateApiKey({ data: apiKeyInput.trim() });
      if (!result.valid) {
        setAuthError("Chave API inválida. Verifique e tente novamente.");
        return;
      }
      const data = await getCrmSettings();
      setSettings(data);
      setAuthenticated(true);
    } catch {
      setAuthError("Erro ao validar a chave. Tente novamente.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  };

  if (!authenticated) {
    return (
      <AuthGate
        apiKeyInput={apiKeyInput}
        setApiKeyInput={setApiKeyInput}
        authError={authError}
        isAuthenticating={isAuthenticating}
        onSubmit={handleAuth}
      />
    );
  }

  return (
    <SettingsDashboard
      settings={settings!}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copied={copied}
      onCopy={copyToClipboard}
    />
  );
}

// ─── Portal de Autenticação ──────────────────────────────────────────────────

function AuthGate({
  apiKeyInput,
  setApiKeyInput,
  authError,
  isAuthenticating,
  onSubmit,
}: {
  apiKeyInput: string;
  setApiKeyInput: (v: string) => void;
  authError: string;
  isAuthenticating: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0B2E1F 0%, #0d1f14 50%, #061209 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Hanken Grotesk', sans-serif", padding: "24px",
    }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 800px 600px at 50% 40%, rgba(201,162,74,0.06) 0%, transparent 70%)",
      }} />

      <div style={{ width: "100%", maxWidth: "440px", position: "relative", zIndex: 1 }}>
        <div style={{
          background: "rgba(11,46,31,0.75)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(201,162,74,0.2)",
          borderRadius: "16px", padding: "48px 40px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,162,74,0.15)",
        }}>
          {/* Ícone e Título */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "12px",
              background: "linear-gradient(135deg, #C9A24A, #D9BC72)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 8px 24px rgba(201,162,74,0.3)",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "#0B2E1F" }}>
                settings_suggest
              </span>
            </div>
            <h1 style={{
              margin: 0, fontSize: "22px", fontWeight: 600,
              color: "#FAF8F2", letterSpacing: "-0.01em",
              fontFamily: "'Libre Caslon Text', serif",
            }}>
              Configurações do CRM
            </h1>
            <p style={{
              margin: "8px 0 0", fontSize: "13px",
              color: "rgba(250,248,242,0.45)", lineHeight: 1.5,
            }}>
              Fenômeno Imóveis · Painel de Integração
            </p>
          </div>

          <div style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(201,162,74,0.3), transparent)",
            marginBottom: "28px",
          }} />

          <p style={{
            fontSize: "13px", color: "rgba(250,248,242,0.6)",
            marginBottom: "22px", lineHeight: 1.65,
          }}>
            Insira a <strong style={{ color: "#D9BC72" }}>Chave API do Site</strong> para acessar e configurar a integração com seu CRM.
          </p>

          <form onSubmit={onSubmit} noValidate>
            <label style={{
              display: "block", fontSize: "11px",
              textTransform: "uppercase", letterSpacing: "0.15em",
              color: "rgba(250,248,242,0.45)", marginBottom: "8px",
            }}>
              Chave API (SITE_TO_CRM_API_KEY)
            </label>
            <input
              id="crm-api-key-input"
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="••••••••••••••••••••••••"
              autoComplete="current-password"
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "14px 16px", marginBottom: "12px",
                background: "rgba(255,255,255,0.05)",
                border: authError ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(201,162,74,0.2)",
                borderRadius: "10px", color: "#FAF8F2", fontSize: "14px",
                outline: "none", fontFamily: "monospace",
              }}
            />

            {authError && (
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 14px",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "8px", marginBottom: "12px",
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#ef4444" }}>error</span>
                <span style={{ fontSize: "13px", color: "#ef4444" }}>{authError}</span>
              </div>
            )}

            <button
              id="crm-auth-submit"
              type="submit"
              disabled={isAuthenticating}
              style={{
                width: "100%", padding: "14px",
                background: isAuthenticating ? "rgba(201,162,74,0.4)" : "linear-gradient(135deg, #C9A24A, #D9BC72)",
                border: "none", borderRadius: "10px",
                color: "#0B2E1F", fontSize: "13px",
                fontWeight: 600, letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: isAuthenticating ? "not-allowed" : "pointer",
                fontFamily: "'Hanken Grotesk', sans-serif",
                boxShadow: isAuthenticating ? "none" : "0 4px 16px rgba(201,162,74,0.3)",
              }}
            >
              {isAuthenticating ? "Verificando…" : "Acessar Painel"}
            </button>
          </form>

          <p style={{
            textAlign: "center", marginTop: "24px",
            fontSize: "11px", color: "rgba(250,248,242,0.25)",
          }}>
            Acesso restrito · Somente administradores
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard de Configurações ──────────────────────────────────────────────

function SettingsDashboard({
  settings,
  activeTab,
  setActiveTab,
  copied,
  onCopy,
}: {
  settings: Settings;
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  copied: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "leads",   label: "Envio de Leads",   icon: "person_add" },
    { id: "imoveis", label: "Receber Imóveis",   icon: "home_work"  },
    { id: "tokens",  label: "Chaves & Tokens",   icon: "key"        },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0B2E1F 0%, #0d1f14 50%, #061209 100%)",
      fontFamily: "'Hanken Grotesk', sans-serif", color: "#FAF8F2",
    }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 1000px 700px at 60% 20%, rgba(201,162,74,0.05) 0%, transparent 70%)",
      }} />

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(11,46,31,0.85)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(201,162,74,0.15)", padding: "0 32px",
      }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: "64px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "8px",
              background: "linear-gradient(135deg, #C9A24A, #D9BC72)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#0B2E1F" }}>
                settings_suggest
              </span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#FAF8F2" }}>
                Integração CRM
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "rgba(250,248,242,0.4)" }}>
                Fenômeno Imóveis · Painel de Configuração
              </p>
            </div>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "6px 14px",
            background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
            borderRadius: "999px",
          }}>
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.6)",
            }} />
            <span style={{ fontSize: "11px", color: "rgba(34,197,94,0.9)", fontWeight: 500 }}>
              Autenticado
            </span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px", position: "relative", zIndex: 1 }}>
        {/* Page heading */}
        <div style={{ marginBottom: "36px" }}>
          <h1 style={{
            margin: "0 0 8px", fontSize: "28px", fontWeight: 700, color: "#FAF8F2",
            letterSpacing: "-0.02em", fontFamily: "'Libre Caslon Text', serif",
          }}>
            Configurações de Integração
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "rgba(250,248,242,0.5)", lineHeight: 1.6 }}>
            Gerencie o fluxo de dados entre o site da Fenômeno Imóveis e o seu CRM.
          </p>
        </div>

        {/* Status cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "40px" }}>
          <StatusCard icon="send"     label="Envio de Leads"    direction="Site → CRM" status={settings.crmLeadsApiUrl ? "active" : "pending"}           detail={settings.crmLeadsApiUrl ? "URL configurada" : "Aguardando URL do CRM"} />
          <StatusCard icon="sync"     label="Receber Imóveis"   direction="CRM → Site" status={settings.crmToSiteBearerToken ? "active" : "pending"}      detail={settings.crmToSiteBearerToken ? "Bearer token ativo" : "Token não configurado"} />
          <StatusCard icon="security" label="Autenticação"      direction="Chaves API"  status={settings.siteToCrmApiKey ? "active" : "pending"}           detail={settings.siteToCrmApiKey ? "Chave API ativa" : "Sem chave configurada"} />
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: "4px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(201,162,74,0.12)",
          borderRadius: "12px", padding: "4px",
          marginBottom: "28px", width: "fit-content",
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`crm-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 18px",
                background: activeTab === tab.id
                  ? "linear-gradient(135deg, rgba(201,162,74,0.25), rgba(217,188,114,0.15))"
                  : "transparent",
                border: activeTab === tab.id ? "1px solid rgba(201,162,74,0.35)" : "1px solid transparent",
                borderRadius: "9px",
                color: activeTab === tab.id ? "#D9BC72" : "rgba(250,248,242,0.5)",
                fontSize: "13px", fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: "pointer", fontFamily: "'Hanken Grotesk', sans-serif",
                whiteSpace: "nowrap", transition: "all 0.2s",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {activeTab === "leads"   && <LeadsTab   settings={settings} copied={copied} onCopy={onCopy} />}
        {activeTab === "imoveis" && <ImoveisTab settings={settings} copied={copied} onCopy={onCopy} />}
        {activeTab === "tokens"  && <TokensTab  settings={settings} copied={copied} onCopy={onCopy} />}
      </main>
    </div>
  );
}

// ─── Status Card Component ───────────────────────────────────────────────────

function StatusCard({ icon, label, direction, status, detail }: {
  icon: string; label: string; direction: string;
  status: "active" | "pending"; detail: string;
}) {
  const isActive = status === "active";
  return (
    <div style={{
      background: "rgba(11,46,31,0.5)",
      border: `1px solid ${isActive ? "rgba(34,197,94,0.2)" : "rgba(201,162,74,0.15)"}`,
      borderRadius: "12px", padding: "20px 24px",
      display: "flex", flexDirection: "column", gap: "12px",
      backdropFilter: "blur(12px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#D9BC72" }}>{icon}</span>
        <span style={{
          fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
          padding: "3px 10px", borderRadius: "999px",
          background: isActive ? "rgba(34,197,94,0.12)" : "rgba(250,176,5,0.12)",
          color: isActive ? "#22c55e" : "#f59e0b",
          border: `1px solid ${isActive ? "rgba(34,197,94,0.3)" : "rgba(250,176,5,0.3)"}`,
        }}>
          {isActive ? "Ativo" : "Pendente"}
        </span>
      </div>
      <div>
        <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: 600, color: "#FAF8F2" }}>{label}</p>
        <p style={{ margin: "0 0 6px", fontSize: "11px", color: "rgba(250,248,242,0.4)", letterSpacing: "0.05em" }}>{direction}</p>
        <p style={{ margin: 0, fontSize: "12px", color: "rgba(250,248,242,0.55)" }}>{detail}</p>
      </div>
    </div>
  );
}

// ─── Leads Tab Component ──────────────────────────────────────────────────────

function LeadsTab({ settings, copied, onCopy }: TabProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <InfoCard title="Como funciona o envio de Leads" icon="info">
        <p style={bodyText}>
          Quando um visitante preenche o formulário de contato no site, os dados são enviados automaticamente para a URL de Leads do CRM configurada abaixo. O site inclui a{" "}
          <strong style={{ color: "#D9BC72" }}>SITE_TO_CRM_API_KEY</strong> no corpo da requisição, no campo{" "}
          <code style={codeStyle}>webhook_token</code>, para autenticar o lead no CRM.
        </p>
      </InfoCard>

      <Section title="URL de Leads do CRM" icon="link">
        <ConfigRow
          label="CRM_LEADS_API_URL"
          value={settings.crmLeadsApiUrl || "Não configurado"}
          copyId="leads-url"
          copied={copied}
          onCopy={onCopy}
          monospace
          empty={!settings.crmLeadsApiUrl}
        />
        <p style={{ margin: "8px 0 0", fontSize: "12px", color: "rgba(250,248,242,0.4)" }}>
          Defina esta variável no arquivo <code style={codeStyle}>.env</code> com a URL fornecida pelo seu CRM.
        </p>
      </Section>

      <Section title="Payload enviado ao CRM" icon="data_object">
        <CodeBlock>{`POST ${settings.crmLeadsApiUrl || "https://api.seu-crm.com/v1/leads"}

Headers:
  Content-Type: application/json

Body:
{
  "name": "Maria Oliveira",
  "email": "maria@email.com",
  "phone": "+5547999999999",
  "message": "Tenho interesse no apartamento Beira Mar.",
  "property_id": "prop_abc123",
  "source": "site",
  "webhook_token": "${settings.siteToCrmApiKey ? maskKey(settings.siteToCrmApiKey) : "<SITE_TO_CRM_API_KEY>"}"
}`}</CodeBlock>
        <p style={{ margin: "12px 0 0", fontSize: "12px", color: "rgba(250,248,242,0.5)", lineHeight: 1.6 }}>
          O campo <code style={codeStyle}>webhook_token</code> recebe o valor da variável{" "}
          <code style={codeStyle}>SITE_TO_CRM_API_KEY</code>. <code style={codeStyle}>property_id</code> é o
          identificador do imóvel no CRM e <code style={codeStyle}>source</code> identifica a origem do lead
          (use <code style={codeStyle}>"site"</code> para envios a partir do site).
        </p>
      </Section>

      <Section title="Variáveis de Ambiente" icon="settings">
        <EnvTable rows={[
          { key: "CRM_LEADS_API_URL",    value: settings.crmLeadsApiUrl || "—",                                           description: "URL do endpoint de leads do CRM",                       required: true },
          { key: "SITE_TO_CRM_API_KEY",  value: settings.siteToCrmApiKey ? maskKey(settings.siteToCrmApiKey) : "—",       description: "Enviado no corpo como campo webhook_token",             required: true },
        ]} />
      </Section>
    </div>
  );
}

// ─── Imóveis Tab Component ────────────────────────────────────────────────────

function ImoveisTab({ settings, copied, onCopy }: TabProps) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://fenomenoimoveis.com.br";
  const webhookUrl = `${origin}/api/properties/sync`;
  const bearerDisplay = settings.crmToSiteBearerToken ? maskKey(settings.crmToSiteBearerToken) : "<CRM_TO_SITE_BEARER_TOKEN>";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <InfoCard title="Como funciona a sincronização de Imóveis" icon="info">
        <p style={bodyText}>
          O CRM envia imóveis para o site via <strong style={{ color: "#D9BC72" }}>Webhook (Push)</strong>.
          Configure seu CRM para enviar requisições <code style={codeStyle}>POST</code> (criar/atualizar) e{" "}
          <code style={codeStyle}>DELETE</code> (remover) para o endpoint abaixo, incluindo o{" "}
          <strong style={{ color: "#D9BC72" }}>Bearer Token</strong> no cabeçalho{" "}
          <code style={codeStyle}>Authorization</code>.
        </p>
      </InfoCard>

      <Section title="Endpoint do Webhook (configure no seu CRM)" icon="webhook">
        <ConfigRow
          label="URL do Webhook"
          value={webhookUrl}
          copyId="webhook-url"
          copied={copied}
          onCopy={onCopy}
          monospace
          highlight
        />
        <div style={{
          marginTop: "12px", padding: "12px 16px",
          background: "rgba(250,176,5,0.07)", border: "1px solid rgba(250,176,5,0.2)",
          borderRadius: "8px",
        }}>
          <p style={{ margin: 0, fontSize: "12px", color: "rgba(250,248,242,0.6)", lineHeight: 1.6 }}>
            ⚙️ <strong>Configure esta URL no painel do seu CRM</strong> como destino de webhook para sincronização de imóveis.
          </p>
        </div>
      </Section>

      <Section title="Adicionar / Atualizar Imóvel (POST)" icon="add_home">
        <CodeBlock>{`POST ${webhookUrl}

Headers:
  Content-Type: application/json
  Authorization: Bearer ${bearerDisplay}

Body:
{
  "slug": "nome-do-imovel",
  "name": "Nome Comercial do Imóvel",
  "location": "Balneário Camboriú",
  "neighborhood": "Barra Sul",
  "type": "Apartamento",
  "price": 8500000,
  "area": 320,
  "bedrooms": 4,
  "suites": 4,
  "parking": 3,
  "description": "Descrição completa do imóvel...",
  "features": ["Vista para o mar", "Piscina privativa"],
  "images": ["https://seu-crm.com/fotos/imovel.jpg"]
}`}</CodeBlock>
      </Section>

      <Section title="Remover Imóvel (DELETE)" icon="home_work">
        <CodeBlock>{`DELETE ${webhookUrl}

Headers:
  Content-Type: application/json
  Authorization: Bearer ${bearerDisplay}

Body:
{
  "slug": "nome-do-imovel"
}`}</CodeBlock>
      </Section>

      <Section title="Variáveis de Ambiente" icon="settings">
        <EnvTable rows={[
          { key: "CRM_TO_SITE_BEARER_TOKEN", value: settings.crmToSiteBearerToken ? maskKey(settings.crmToSiteBearerToken) : "—", description: "Bearer token que o CRM envia para autenticar no site", required: true },
        ]} />
      </Section>
    </div>
  );
}

// ─── Tokens Tab Component ─────────────────────────────────────────────────────

function TokensTab({ settings, copied, onCopy }: TabProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <InfoCard title="Gerenciamento de Chaves" icon="shield">
        <p style={bodyText}>
          Todas as chaves são armazenadas nas <strong style={{ color: "#D9BC72" }}>variáveis de ambiente</strong> do servidor e nunca expostas ao cliente. Para alterar qualquer chave, edite o arquivo <code style={codeStyle}>.env</code> e reinicie o servidor.
        </p>
      </InfoCard>

      <Section title="Chaves Configuradas" icon="key">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TokenRow
            name="SITE_TO_CRM_API_KEY"
            description="Chave que o Site envia para o CRM no corpo do lead, no campo webhook_token. Configure esta mesma chave no CRM para validar leads recebidos."
            direction="Site → CRM"
            value={settings.siteToCrmApiKey}
            copyId="token-site-crm"
            copied={copied}
            onCopy={onCopy}
          />
          <TokenRow
            name="CRM_TO_SITE_BEARER_TOKEN"
            description="Bearer token que o CRM deve enviar no cabeçalho Authorization ao chamar os webhooks do site. Configure no seu CRM como credencial de saída."
            direction="CRM → Site"
            value={settings.crmToSiteBearerToken}
            copyId="token-crm-site"
            copied={copied}
            onCopy={onCopy}
          />
        </div>
      </Section>

      <Section title="Arquivo .env Completo" icon="description">
        <CodeBlock>{`# .env — Fenômeno Imóveis · Integração CRM

# Token que o CRM usa para autenticar ao enviar imóveis (CRM → Site)
# Cabeçalho: Authorization: Bearer <TOKEN>
CRM_TO_SITE_BEARER_TOKEN="${settings.crmToSiteBearerToken || "SEU_TOKEN_AQUI"}"

# Chave que o Site envia no corpo do lead (campo webhook_token) — Site → CRM
SITE_TO_CRM_API_KEY="${settings.siteToCrmApiKey || "SUA_CHAVE_AQUI"}"

# URL do endpoint de Leads do seu CRM
CRM_LEADS_API_URL="${settings.crmLeadsApiUrl || "https://api.seu-crm.com/v1/leads"}"`}</CodeBlock>
      </Section>

      <div style={{
        padding: "16px 20px",
        background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)",
        borderRadius: "12px", display: "flex", gap: "12px", alignItems: "flex-start",
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#ef4444", flexShrink: 0, marginTop: "1px" }}>
          lock
        </span>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: 600, color: "#ef4444" }}>
            Segurança
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "rgba(250,248,242,0.55)", lineHeight: 1.6 }}>
            Nunca compartilhe estas chaves publicamente. Adicione <code style={codeStyle}>.env</code> ao seu <code style={codeStyle}>.gitignore</code>. Regenere as chaves imediatamente se suspeitar de comprometimento.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Componentes Utilitários Compartilhados ──────────────────────────────────

type TabProps = {
  settings: Settings;
  copied: string | null;
  onCopy: (text: string, id: string) => void;
};

function InfoCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "rgba(217,188,114,0.06)", border: "1px solid rgba(201,162,74,0.2)",
      borderRadius: "12px", padding: "20px 24px", display: "flex", gap: "14px",
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#D9BC72", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: 600, color: "#D9BC72", letterSpacing: "0.02em" }}>{title}</p>
        {children}
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "rgba(11,46,31,0.4)", border: "1px solid rgba(201,162,74,0.12)",
      borderRadius: "14px", overflow: "hidden",
    }}>
      <div style={{
        padding: "16px 24px", borderBottom: "1px solid rgba(201,162,74,0.1)",
        display: "flex", alignItems: "center", gap: "10px",
        background: "rgba(255,255,255,0.02)",
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#D9BC72" }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#FAF8F2" }}>{title}</h3>
      </div>
      <div style={{ padding: "20px 24px" }}>{children}</div>
    </div>
  );
}

function ConfigRow({ label, value, copyId, copied, onCopy, monospace = false, highlight = false, empty = false }: {
  label: string; value: string; copyId: string;
  copied: string | null; onCopy: (t: string, id: string) => void;
  monospace?: boolean; highlight?: boolean; empty?: boolean;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px",
      padding: "12px 16px",
      background: highlight ? "rgba(217,188,114,0.06)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${highlight ? "rgba(201,162,74,0.25)" : "rgba(255,255,255,0.06)"}`,
      borderRadius: "10px",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: "0 0 2px", fontSize: "10px", color: "rgba(250,248,242,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</p>
        <p style={{
          margin: 0, fontSize: "13px",
          fontFamily: monospace ? "monospace" : "inherit",
          color: empty ? "rgba(250,248,242,0.3)" : "#FAF8F2",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {value}
        </p>
      </div>
      {!empty && (
        <button
          id={`copy-${copyId}`}
          onClick={() => onCopy(value, copyId)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: copied === copyId ? "#22c55e" : "rgba(250,248,242,0.4)",
            padding: "4px", borderRadius: "6px", flexShrink: 0, transition: "color 0.2s",
          }}
          title="Copiar"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
            {copied === copyId ? "check" : "content_copy"}
          </span>
        </button>
      )}
    </div>
  );
}

function TokenRow({ name, description, direction, value, copyId, copied, onCopy }: {
  name: string; description: string; direction: string;
  value: string; copyId: string; copied: string | null;
  onCopy: (t: string, id: string) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const hasValue = Boolean(value);

  return (
    <div style={{ padding: "18px 20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px" }}>
      <div style={{ marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <code style={{ ...codeStyle, fontSize: "13px", color: "#D9BC72" }}>{name}</code>
          <span style={{
            fontSize: "10px", padding: "2px 8px", borderRadius: "999px",
            background: "rgba(201,162,74,0.1)", border: "1px solid rgba(201,162,74,0.2)",
            color: "rgba(217,188,114,0.7)", letterSpacing: "0.06em",
          }}>{direction}</span>
        </div>
        <p style={{ margin: 0, fontSize: "12px", color: "rgba(250,248,242,0.5)", lineHeight: 1.5 }}>{description}</p>
      </div>
      {hasValue ? (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            flex: 1, padding: "8px 12px", background: "rgba(0,0,0,0.3)", borderRadius: "8px",
            fontFamily: "monospace", fontSize: "12px",
            color: revealed ? "#FAF8F2" : "rgba(250,248,242,0.3)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {revealed ? value : maskKey(value)}
          </div>
          <IconBtn onClick={() => setRevealed(!revealed)} title={revealed ? "Ocultar" : "Revelar"} icon={revealed ? "visibility_off" : "visibility"} />
          <IconBtn
            id={`copy-token-${copyId}`}
            onClick={() => onCopy(value, copyId)}
            title="Copiar"
            icon={copied === copyId ? "check" : "content_copy"}
            active={copied === copyId}
          />
        </div>
      ) : (
        <div style={{
          padding: "8px 12px", borderRadius: "8px",
          background: "rgba(250,176,5,0.06)", border: "1px solid rgba(250,176,5,0.15)",
          fontSize: "12px", color: "rgba(250,176,5,0.7)",
        }}>
          ⚠️ Não configurado — defina a variável <code style={codeStyle}>{name}</code> no arquivo <code style={codeStyle}>.env</code>
        </div>
      )}
    </div>
  );
}

function IconBtn({ onClick, title, icon, active = false, id }: {
  onClick: () => void; title: string; icon: string; active?: boolean; id?: string;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      title={title}
      style={{
        background: active ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)",
        border: `1px solid ${active ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "8px", padding: "8px",
        color: active ? "#22c55e" : "rgba(250,248,242,0.5)",
        cursor: "pointer", display: "flex", alignItems: "center", transition: "all 0.2s",
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>{icon}</span>
    </button>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre style={{
      margin: 0, padding: "18px 20px",
      background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "10px", fontFamily: "monospace", fontSize: "12px",
      color: "rgba(250,248,242,0.75)", overflowX: "auto", lineHeight: 1.7, whiteSpace: "pre",
    }}>
      {children}
    </pre>
  );
}

function EnvTable({ rows }: {
  rows: { key: string; value: string; description: string; required: boolean }[];
}) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr>
            {["Variável", "Valor Atual", "Descrição", ""].map((h) => (
              <th key={h} style={{
                textAlign: "left", padding: "8px 12px",
                color: "rgba(250,248,242,0.4)", fontWeight: 500, fontSize: "11px",
                letterSpacing: "0.08em", textTransform: "uppercase",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <td style={{ padding: "12px 12px" }}>
                <code style={{ ...codeStyle, color: "#D9BC72" }}>{row.key}</code>
              </td>
              <td style={{ padding: "12px 12px" }}>
                <span style={{ fontFamily: "monospace", fontSize: "12px", color: row.value === "—" ? "rgba(250,248,242,0.3)" : "#FAF8F2" }}>
                  {row.value}
                </span>
              </td>
              <td style={{ padding: "12px 12px", color: "rgba(250,248,242,0.55)" }}>{row.description}</td>
              <td style={{ padding: "12px 12px" }}>
                {row.required && (
                  <span style={{
                    fontSize: "10px", padding: "2px 8px", borderRadius: "999px",
                    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                    color: "#ef4444", letterSpacing: "0.05em",
                  }}>
                    Obrigatório
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Estilos e Helpers Gerais ───────────────────────────────────────────────

const codeStyle: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "12px",
  background: "rgba(255,255,255,0.08)",
  padding: "1px 6px",
  borderRadius: "4px",
  color: "rgba(250,248,242,0.8)",
};

const bodyText: React.CSSProperties = {
  margin: 0,
  fontSize: "14px",
  color: "rgba(250,248,242,0.7)",
  lineHeight: 1.7,
};

function maskKey(value: string): string {
  if (value.length <= 8) return "••••••••";
  return value.slice(0, 4) + "••••••••••••" + value.slice(-4);
}
