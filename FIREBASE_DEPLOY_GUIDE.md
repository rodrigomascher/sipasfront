# 🚀 Deploy Frontend no Firebase Hosting

## Passo 1️⃣: Instalar Firebase CLI (2 minutos)

```powershell
npm install -g firebase-tools
```

Verifique:
```powershell
firebase --version
```

---

## Passo 2️⃣: Login no Firebase (3 minutos)

```powershell
firebase login
```

Vai abrir navegador - faça login com sua conta Google (rodrigo.mascher@gmail.com)

Depois confirme no terminal com `y`

---

## Passo 3️⃣: Navegar para o Frontend (1 minuto)

```powershell
cd c:\Users\Admin\Documents\SIPAS\front
```

---

## Passo 4️⃣: Fazer Build do Angular (3 minutos)

```powershell
npm run build:prod
```

Vai gerar pasta `dist/sipas-front/` com os arquivos estáticos.

Verifique:
```powershell
ls dist/sipas-front/
```

Deve ter arquivos `.js`, `.css`, `index.html`, etc.

---

## Passo 5️⃣: Inicializar Firebase Hosting (1 minuto)

```powershell
firebase init hosting
```

Perguntas:
```
? What do you want to use as your public directory? 
→ dist/sipas-front

? Configure as a single-page app (rewrite all urls to index.html)? 
→ y

? Set up automatic builds and deploys with GitHub? 
→ n (por enquanto)

? File dist/sipas-front/404.html already exists. Overwrite? 
→ y

? File dist/sipas-front/index.html already exists. Overwrite? 
→ n
```

✅ Arquivo `firebase.json` foi criado!

---

## Passo 6️⃣: Verificar Configuração (1 minuto)

Abra `firebase.json` e confirme:

```json
{
  "hosting": {
    "public": "dist/sipas-front",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## Passo 7️⃣: Deploy! 🚀 (2 minutos)

```powershell
firebase deploy --only hosting
```

**Aguarde 2-3 minutos...**

Quando terminar:
```
✓ Deploy complete!

Project Console: https://console.firebase.google.com/project/sipas-web-XXXXX
Hosting URL: https://sipas-web.web.app
```

✅ **FRONTEND ONLINE!**

---

## 🎯 Resultado Final

| Serviço | URL |
|---------|-----|
| **Backend** | https://sipas-backend-797203546871.southamerica-east1.run.app |
| **Frontend** | https://sipas-web.web.app |
| **API Docs** | https://sipas-backend-797203546871.southamerica-east1.run.app/api/docs |

---

## 🔧 Próximas Vezes

Para redeploiar após fazer mudanças:

```powershell
# Build
npm run build:prod

# Deploy
firebase deploy --only hosting
```

Ou em um comando:
```powershell
npm run build:prod && firebase deploy --only hosting
```

---

## 📊 Monitoramento

Ver logs e status:
```powershell
# Ver último deploy
firebase deploy:list

# Ver logs
firebase functions:log

# Estatísticas
firebase hosting:channel:list
```

---

## 🛠️ Troubleshooting

**Problema**: "Permission denied"  
**Solução**: Faça login novamente: `firebase login --reauth`

**Problema**: "Hosting bucket not found"  
**Solução**: Já foi criado durante o setup, tente logout + login: `firebase logout && firebase login`

**Problema**: Mudanças não aparecem  
**Solução**: Limpe cache do navegador (Ctrl+Shift+Del) ou use incógnito

---

**Status**: ✅ Frontend pronto para deploy!
