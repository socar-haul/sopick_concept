import { useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Categories from './components/Categories.jsx'
import Pricing from './components/Pricing.jsx'
import Trust from './components/Trust.jsx'
import Footer from './components/Footer.jsx'
import CompareBar from './components/CompareBar.jsx'

const MAX_COMPARE = 3

export default function App() {
  const [compareIds, setCompareIds] = useState([])

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, id]
    })
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Categories />
        <Pricing compareIds={compareIds} onToggleCompare={toggleCompare} />
        <Trust />
      </main>
      <Footer />
      <CompareBar
        compareIds={compareIds}
        onToggleCompare={toggleCompare}
        onClear={() => setCompareIds([])}
      />
    </>
  )
}
