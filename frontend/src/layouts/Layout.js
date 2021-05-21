export function Layout({ children }) {
  return (
    <div>
      <header>Header</header>
      <main>
        <h1>Layout</h1>
        {children}
      </main>
    </div>
  )
}