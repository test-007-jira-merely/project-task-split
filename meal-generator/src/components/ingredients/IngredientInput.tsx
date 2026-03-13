import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Plus } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { IngredientTag } from './IngredientTag'

interface IngredientInputProps {
  ingredients: string[]
  onAdd: (ingredient: string) => void
  onRemove: (ingredient: string) => void
  suggestions?: string[]
}

export const IngredientInput = ({
  ingredients,
  onAdd,
  onRemove,
  suggestions = [],
}: IngredientInputProps) => {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(input.toLowerCase()) &&
      !ingredients.includes(s.toLowerCase())
  )

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim())
      setInput('')
      setShowSuggestions(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onAdd(suggestion)
    setInput('')
    setShowSuggestions(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setShowSuggestions(true)
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Enter ingredient (e.g., chicken, rice)"
            fullWidth
          />
          {showSuggestions && input && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto"
            >
              {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                >
                  <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
        <Button onClick={handleAdd} size="md" disabled={!input.trim()}>
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {ingredients.map((ingredient) => (
              <IngredientTag
                key={ingredient}
                ingredient={ingredient}
                onRemove={() => onRemove(ingredient)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
