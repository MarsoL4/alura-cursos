import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../../../http/posts'
import { Button } from '../../atoms/Button/Button'
import { Input } from '../../atoms/Input/Input'
import { Label } from '../../atoms/Label/Label'
import { ThumbnailPlaceholder } from '../../atoms/ThumbnailPlaceholder/ThumbnailPlaceholder'

export function PublishPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    // Gera URL temporária para preview
    const url = URL.createObjectURL(file)
    setThumbnailUrl(url)
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().replace(/,$/, '')
      if (newTag && !tags.includes(newTag)) {
        setTags((prev) => [...prev, newTag])
      }
      setTagInput('')
    }
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) {
      setError('Título e descrição são obrigatórios.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await createPost({
        title: title.trim(),
        content: content.trim(),
        tags: tags.length > 0 ? tags : undefined,
        thumbnail: thumbnailUrl ?? undefined,
      })
      navigate('/')
    } catch {
      setError('Erro ao publicar. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleDiscard() {
    navigate('/')
  }

  return (
    <div className="bg-cinza-escuro flex flex-col items-end justify-end p-8 rounded-lg w-full">
      <div className="flex flex-col items-start w-full">
        <div className="flex gap-6 items-start justify-center w-full">
          {/* Lado esquerdo: imagem */}
          <div className="flex flex-col gap-4 items-start shrink-0">
            <div className="flex flex-col items-center w-[486px]">
              <div className="flex flex-col items-center bg-cinza-medio px-4 py-6 rounded-lg w-full">
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt="Preview"
                    className="h-80 w-full object-cover rounded-lg shadow-lg"
                  />
                ) : (
                  <ThumbnailPlaceholder className="h-80 w-full" />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 items-start w-[486px]">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="border border-cinza-medio text-cinza-medio flex gap-2 items-center justify-center px-4 py-3 rounded-lg w-full text-lg font-semibold hover:border-cinza-claro hover:text-cinza-claro transition-colors"
              >
                Carregar imagem
                <span className="material-icons">upload</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {fileName && (
                <div className="flex gap-2 items-center text-cinza-medio text-sm">
                  <span>{fileName}</span>
                  <button
                    type="button"
                    onClick={() => { setFileName(null); setThumbnailUrl(null) }}
                    className="material-icons text-sm leading-none"
                    aria-label="Remover imagem"
                  >
                    close
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Lado direito: formulário */}
          <div className="flex flex-1 flex-col gap-10 items-center min-w-0">
            <h1 className="text-offwhite text-3xl font-semibold leading-[1.5] w-full">
              Novo projeto
            </h1>

            <div className="flex flex-col gap-6 items-center w-full">
              {/* Nome do projeto */}
              <div className="flex flex-col gap-2 items-start w-full">
                <Label htmlFor="title">Nome do projeto</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="React zero to hero"
                />
              </div>

              {/* Descrição */}
              <div className="flex flex-col gap-2 items-start w-full">
                <Label htmlFor="content">Descrição</Label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Descreva seu projeto..."
                  rows={6}
                  className="w-full bg-cinza-medio text-grafite placeholder-grafite rounded px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-verde-destaque focus:ring-opacity-50 border border-transparent focus:border-verde-destaque transition-colors resize-none"
                />
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-4 items-start justify-center w-full">
                <div className="flex flex-col gap-2 items-start w-full">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Digite e pressione Enter para adicionar"
                  />
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-4 items-center">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-cinza-medio flex gap-2 items-center px-2 py-1 rounded text-grafite text-lg"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="material-icons text-sm leading-none"
                          aria-label={`Remover tag ${tag}`}
                        >
                          close
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm w-full">{error}</p>
            )}

            {/* Ações */}
            <div className="flex gap-6 items-center w-full">
              <button
                type="button"
                onClick={handleDiscard}
                className="border border-verde-destaque text-verde-destaque flex flex-1 gap-2 items-center justify-center px-4 py-3 rounded-lg text-lg font-semibold hover:bg-verde-destaque/10 transition-colors"
              >
                Descartar
                <span className="material-icons">delete</span>
              </button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? 'Publicando…' : 'Publicar'}
                {!submitting && <span className="material-icons">publish</span>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
