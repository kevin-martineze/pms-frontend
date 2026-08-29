"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  requestPasswordReset,
  resetPasswordWithToken,
} from "@/lib/auth/password-actions";
import { useI18n } from "@/lib/i18n/provider";

/**
 * La puerta del panel: entrar, pedir contraseña nueva y fijarla.
 *
 * Los tres pasos viven acá y no en rutas propias porque el layout del panel
 * muestra esta pantalla siempre que no hay sesión — una ruta `/recuperar` bajo
 * `/admin` mostraría el login en su lugar. El enlace del correo trae el token
 * en la URL (`?reset=…`), y con eso alcanza para saber en qué paso estamos.
 */
type Step = "login" | "forgot" | "reset";

export function AdminLoginScreen() {
  const params = useSearchParams();

  const token = params.get("reset");
  const [step, setStep] = React.useState<Step>(token ? "reset" : "login");

  if (step === "forgot") return <ForgotForm onBack={() => setStep("login")} />;
  if (step === "reset" && token) {
    return <ResetForm token={token} onDone={() => setStep("login")} />;
  }
  return <LoginForm onForgot={() => setStep("forgot")} />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-sidebar p-4">
      <Card className="w-full max-w-sm">{children}</Card>
    </div>
  );
}

function LoginForm({ onForgot }: { onForgot: () => void }) {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body: unknown = await res.json().catch(() => null);
        const message =
          body && typeof body === "object" && "message" in body
            ? String((body as { message: unknown }).message)
            : t.admin.login.failed;
        setError(message);
        return;
      }

      /* La cookie ya está puesta; `refresh()` hace que el layout (Server
         Component) vuelva a renderizar, ahora con sesión, y muestre el panel. */
      router.refresh();
    } catch {
      setError(t.admin.login.offline);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Shell>
        <CardHeader>
          <span className="display-sm text-lg">Daughters of Sun</span>
          <CardTitle>{t.admin.login.title}</CardTitle>
          <CardDescription>{t.admin.login.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="admin-login-email">{t.admin.login.email}</Label>
              <Input
                id="admin-login-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="admin-login-password">{t.admin.login.password}</Label>
              <Input
                id="admin-login-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" disabled={loading} className="mt-1">
              {loading ? t.admin.login.submitting : t.admin.login.submit}
            </Button>
            <button
              type="button"
              onClick={onForgot}
              className="mt-1 text-sm text-muted-foreground underline-offset-2 hover:underline"
            >
              {t.admin.login.forgot}
            </button>
          </form>
        </CardContent>
    </Shell>
  );
}

/**
 * Pedir el enlace.
 *
 * Confirma el envío **siempre**, exista o no la cuenta. Decir "no encontramos
 * ese correo" convertiría esta pantalla en una forma de averiguar quién trabaja
 * en el hotel.
 */
function ForgotForm({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  if (sent) {
    return (
      <Shell>
        <CardHeader>
          <CardTitle>{t.admin.login.forgotSentTitle}</CardTitle>
          <CardDescription>{t.admin.login.forgotSentBody}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" className="w-full" onClick={onBack}>
            {t.admin.login.backToLogin}
          </Button>
        </CardContent>
      </Shell>
    );
  }

  return (
    <Shell>
      <CardHeader>
        <CardTitle>{t.admin.login.forgotTitle}</CardTitle>
        <CardDescription>{t.admin.login.forgotBody}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            startTransition(async () => {
              const result = await requestPasswordReset(email.trim());
              if (result.ok) setSent(true);
              else setError(result.error);
            });
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="forgot-email">{t.admin.login.email}</Label>
            <Input
              id="forgot-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? t.admin.login.submitting : t.admin.login.forgotSubmit}
          </Button>
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-muted-foreground underline-offset-2 hover:underline"
          >
            {t.admin.login.backToLogin}
          </button>
        </form>
      </CardContent>
    </Shell>
  );
}

/** Fijar la contraseña nueva con el token del enlace. */
function ResetForm({ token, onDone }: { token: string; onDone: () => void }) {
  const { t } = useI18n();
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  const tooShort = password.length > 0 && password.length < 10;

  return (
    <Shell>
      <CardHeader>
        <CardTitle>{t.admin.login.resetTitle}</CardTitle>
        <CardDescription>{t.admin.login.resetBody}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            startTransition(async () => {
              const result = await resetPasswordWithToken(token, password);
              if (result.ok) {
                /* Se limpia el token de la URL: dejarlo ahí lo deja en el
                   historial del navegador y en cualquier captura de pantalla. */
                router.replace(window.location.pathname);
                onDone();
              } else {
                setError(result.error);
              }
            });
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reset-password">{t.admin.login.newPassword}</Label>
            <Input
              id="reset-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={10}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{t.admin.login.passwordHint}</p>
          </div>
          {tooShort && (
            <p className="text-sm text-destructive">{t.admin.login.passwordShort}</p>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={pending || password.length < 10}>
            {pending ? t.admin.login.submitting : t.admin.login.resetSubmit}
          </Button>
        </form>
      </CardContent>
    </Shell>
  );
}
