import { Link } from 'react-router-dom'
import { ThumbnailPlaceholder } from '../../atoms/ThumbnailPlaceholder/ThumbnailPlaceholder'

interface PostCardProps {
  id: string
  title: string
  content: string
  thumbnail: string | null
  tags?: string[]
  author: { name: string }
  likesCount: number
  commentsCount: number
}

export function PostCard({
  id,
  title,
  content,
  thumbnail,
  tags = [],
  author,
  likesCount,
  commentsCount,
}: PostCardProps) {
  const excerpt = content.length > 200 ? content.slice(0, 200) + '…' : content

  return (
    <Link
      to={`/posts/${id}`}
      className="flex flex-col items-start rounded-lg overflow-hidden hover:opacity-90 transition-opacity max-w-[486px] w-full"
    >
      {/* Thumbnail area */}
      <div className="bg-cinza-medio flex flex-col h-60 items-start p-6 rounded-tl-lg rounded-tr-lg w-full">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        ) : (
          <ThumbnailPlaceholder className="w-full h-full" />
        )}
      </div>

      {/* Content area */}
      <div className="bg-cinza-escuro flex items-start p-4 rounded-bl-lg rounded-br-lg w-full">
        <div className="flex flex-1 flex-col gap-4 items-start min-w-0">
          {/* Title + excerpt */}
          <div className="flex flex-col gap-2 items-start text-cinza-claro w-full">
            <h2 className="text-lg font-semibold leading-[1.5] w-full line-clamp-2">{title}</h2>
            <p className="text-base leading-[1.5] w-full line-clamp-3">{excerpt}</p>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-start w-full">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-cinza-escuro border border-cinza-medio text-cinza-claro text-sm px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer: icons + author */}
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-4 items-center text-cinza-medio">
              <span className="flex flex-col items-center text-xs">
                <span className="material-icons" style={{ fontSize: '1.5rem' }}>code</span>
                <span className="leading-[1.5]">{likesCount}</span>
              </span>
              <span className="flex flex-col items-center text-xs">
                <span className="material-icons" style={{ fontSize: '1.5rem' }}>chat</span>
                <span className="leading-[1.5]">{commentsCount}</span>
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <div className="size-8 rounded-full bg-cinza-medio flex items-center justify-center text-xs font-semibold text-grafite">
                {author.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-cinza-medio text-sm font-semibold leading-[1.5]">
                @{author.name.toLowerCase().split(' ')[0]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
