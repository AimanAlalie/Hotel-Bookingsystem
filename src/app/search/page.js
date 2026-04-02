import SearchResults from './SearchResults'

export const metadata = {
  title: 'Search Results | YemenStay',
  description: 'Find available hotels and rooms in Yemen',
}

export default function SearchPage({ searchParams }) {
  return <SearchResults searchParams={searchParams} />
}
