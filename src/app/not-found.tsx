import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="mb-2 font-serif text-xl font-medium text-ink">Такой страницы нет</p>
      <p className="mb-6 max-w-sm text-sm leading-[1.6] text-ink-soft">
        Возможно, ссылка устарела. Дерево на месте — можно вернуться к нему.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-ink px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-black"
      >
        К дереву
      </Link>
    </div>
  );
}
