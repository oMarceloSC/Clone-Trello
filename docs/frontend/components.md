# Componentes Compartilhados

## Visão Geral

O frontend do Clone do Trello foi planejado para utilizar componentes reutilizáveis conforme a aplicação evoluir.

Nesta etapa inicial, os componentes ainda estão implementados diretamente nas páginas de autenticação.

À medida que novas funcionalidades forem desenvolvidas, esses elementos serão extraídos para uma biblioteca própria de componentes.

---

# Estrutura Planejada

Os componentes compartilhados serão organizados em:

```text
src/

components/

├── Button/

├── Input/

├── TextArea/

├── Select/

├── Checkbox/

├── Modal/

├── Avatar/

├── Badge/

├── Dropdown/

├── Sidebar/

├── Navbar/

├── Card/

├── Spinner/

├── EmptyState/

└── ConfirmDialog/
```

Cada componente possuirá sua própria estrutura.

Exemplo:

```text
Button/

Button.tsx

Button.css

index.ts
```

---

# Princípios

Todos os componentes deverão:

- Ser reutilizáveis.
- Possuir tipagem completa.
- Ser independentes.
- Receber dados via Props.
- Não conter regras de negócio.
- Possuir responsabilidade única.

---

# Estado Atual

Atualmente os elementos da interface permanecem dentro das páginas:

- LoginPage.
- RegisterPage.
- DashboardPage.

Essa decisão foi tomada para simplificar a primeira integração entre frontend e backend.

---

# Próximas Implementações

Os primeiros componentes compartilhados serão:

- Button.
- Input.
- FormField.
- Card.
- Spinner.
- EmptyState.
- Modal.

Esses componentes servirão de base para toda a interface da aplicação.

---

# Evolução

Após a implementação do Design System, este documento será atualizado contendo:

- API de cada componente.
- Propriedades.
- Exemplos de uso.
- Padrões visuais.
- Boas práticas.