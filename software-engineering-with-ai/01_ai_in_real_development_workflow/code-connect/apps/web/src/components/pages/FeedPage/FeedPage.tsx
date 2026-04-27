import { useEffect, useRef, useState } from 'react'
import { getPosts, type Post } from '../../../http/posts'
import { SearchBar } from '../../molecules/SearchBar/SearchBar'
import { PostCard } from '../../organisms/PostCard/PostCard'

export function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function fetchPosts(searchValue: string, pageValue: number) {
    setLoading(true)
    getPosts({ search: searchValue || undefined, page: pageValue, limit: 10 })
      .then((res) => {
        if (pageValue === 1) {
          setPosts(res.data.data)
        } else {
          setPosts((prev) => [...prev, ...res.data.data])
        }
        setTotalPages(res.data.meta.totalPages)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setPage(1)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchPosts(search, 1)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [search])

  function handleLoadMore() {
    const next = page + 1
    setPage(next)
    fetchPosts(search, next)
  }

  return (
    <div className="flex flex-col gap-14">
      {/* Busca */}
      <div className="flex flex-col gap-4">
        <SearchBar value={search} onChange={setSearch} />
        {search && (
          <div className="flex items-center justify-between">
            <div className="flex gap-6 items-center">
              <span className="bg-cinza-medio flex gap-2 items-center px-2 py-1 rounded text-grafite text-lg">
                {search}
                <button
                  onClick={() => setSearch('')}
                  className="material-icons text-sm leading-none"
                  aria-label="Limpar busca"
                >
                  close
                </button>
              </span>
            </div>
            <button
              onClick={() => setSearch('')}
              className="text-cinza-medio text-lg leading-[1.5] hover:text-cinza-claro transition-colors"
            >
              Limpar tudo
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-col gap-8">
        <div className="flex gap-6 items-center justify-center">
          <span className="text-verde-destaque text-2xl font-semibold leading-[1.5] underline decoration-solid px-1">
            Recentes
          </span>
        </div>

        {/* Grid de posts */}
        {loading && posts.length === 0 ? (
          <div className="flex flex-wrap gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="max-w-[486px] w-full rounded-lg overflow-hidden animate-pulse">
                <div className="bg-cinza-escuro h-60 rounded-tl-lg rounded-tr-lg" />
                <div className="bg-cinza-escuro p-4 rounded-bl-lg rounded-br-lg">
                  <div className="bg-cinza-medio h-5 rounded mb-2 w-3/4" />
                  <div className="bg-cinza-medio h-4 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="material-icons text-cinza-medio" style={{ fontSize: '4rem' }}>
              search_off
            </span>
            <p className="text-cinza-medio text-lg">Nenhum post encontrado.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                thumbnail={post.thumbnail}
                tags={post.tags}
                author={post.author}
                likesCount={post.likesCount}
                commentsCount={post.commentsCount}
              />
            ))}
          </div>
        )}

        {/* Carregar mais */}
        {!loading && page < totalPages && (
          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              className="border border-verde-destaque text-verde-destaque px-8 py-3 rounded-lg text-lg leading-[1.5] hover:bg-verde-destaque/10 transition-colors"
            >
              Carregar mais
            </button>
          </div>
        )}

        {loading && posts.length > 0 && (
          <div className="flex justify-center py-4">
            <span className="text-cinza-medio text-base">Carregando…</span>
          </div>
        )}
      </div>
    </div>
  )
}
