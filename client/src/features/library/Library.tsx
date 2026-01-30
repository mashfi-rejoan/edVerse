import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Book, Search, Filter, BookOpen, BookmarkCheck, CalendarClock, Star } from 'lucide-react';
import { apiUrl } from '../../utils/apiBase';

interface LibraryBook {
  _id: string;
  title: string;
  author: string;
  category: string;
  availableCopies: number;
  totalCopies: number;
  rating?: number;
  isbn?: string;
  edition?: string;
  year?: number;
  shelf?: string;
  isEbook?: boolean;
  borrowedByMe?: boolean;
  dueDate?: string;
}

const mockBooks: LibraryBook[] = [
  {
    _id: '1',
    title: 'Introduction to Algorithms',
    author: 'Cormen, Leiserson, Rivest, Stein',
    category: 'Computer Science',
    availableCopies: 2,
    totalCopies: 5,
    rating: 4.8,
    isbn: '9780262033848',
    edition: '3rd',
    year: 2009,
    shelf: 'CS-01',
  },
  {
    _id: '2',
    title: 'Database System Concepts',
    author: 'Silberschatz, Korth, Sudarshan',
    category: 'Database',
    availableCopies: 0,
    totalCopies: 4,
    rating: 4.6,
    isbn: '9780073523323',
    edition: '7th',
    year: 2019,
    shelf: 'DB-04',
  },
  {
    _id: '3',
    title: 'Operating System Concepts',
    author: 'Silberschatz, Galvin, Gagne',
    category: 'Computer Science',
    availableCopies: 1,
    totalCopies: 3,
    rating: 4.4,
    isbn: '9781118063330',
    edition: '10th',
    year: 2018,
    shelf: 'CS-07',
    borrowedByMe: true,
    dueDate: '2026-02-08',
  },
  {
    _id: '4',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Software Engineering',
    availableCopies: 3,
    totalCopies: 3,
    rating: 4.7,
    isbn: '9780132350884',
    edition: '1st',
    year: 2008,
    shelf: 'SE-02',
    isEbook: true,
  },
  {
    _id: '5',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Russell, Norvig',
    category: 'AI',
    availableCopies: 1,
    totalCopies: 2,
    rating: 4.5,
    isbn: '9780136042594',
    edition: '4th',
    year: 2021,
    shelf: 'AI-01',
  },
  {
    _id: '6',
    title: 'Computer Networks',
    author: 'Andrew S. Tanenbaum',
    category: 'Networking',
    availableCopies: 2,
    totalCopies: 3,
    rating: 4.3,
    isbn: '9780132126953',
    edition: '5th',
    year: 2011,
    shelf: 'NW-03',
    borrowedByMe: true,
    dueDate: '2026-02-12',
  },
  {
    _id: '7',
    title: 'Discrete Mathematics and Its Applications',
    author: 'Kenneth H. Rosen',
    category: 'Mathematics',
    availableCopies: 4,
    totalCopies: 6,
    rating: 4.2,
    isbn: '9780073383095',
    edition: '8th',
    year: 2019,
    shelf: 'MTH-05',
  },
  {
    _id: '8',
    title: 'Software Requirements',
    author: 'Karl Wiegers',
    category: 'Software Engineering',
    availableCopies: 1,
    totalCopies: 2,
    rating: 4.1,
    isbn: '9780735679665',
    edition: '3rd',
    year: 2013,
    shelf: 'SE-08',
    isEbook: true,
  },
];

const Library = () => {
  const [books, setBooks] = useState<LibraryBook[]>(mockBooks);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl('/api/shared/library'));
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setBooks(data);
        }
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Computer Science', 'Database', 'Software Engineering', 'AI', 'Networking', 'Mathematics'];

  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesAvailability = !showAvailableOnly || book.availableCopies > 0;

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const borrowedBooks = books.filter((book) => book.borrowedByMe);
  const totalBooks = books.length;
  const totalAvailable = books.reduce((sum, book) => sum + book.availableCopies, 0);
  const totalBorrowedByMe = borrowedBooks.length;

  const holidayDates = new Set([
    '2026-02-04',
    '2026-02-21',
    '2026-03-26',
    '2026-04-14',
    '2026-05-01',
  ]);

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 5 || day === 6; // Friday, Saturday
  };

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getOverdueDays = (dueDate?: string) => {
    if (!dueDate) return 0;
    const due = new Date(dueDate);
    const today = new Date();
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (today <= due) return 0;

    let count = 0;
    const cursor = new Date(due);
    cursor.setDate(cursor.getDate() + 1);

    while (cursor <= today) {
      const dateKey = formatDateKey(cursor);
      if (!isWeekend(cursor) && !holidayDates.has(dateKey)) {
        count += 1;
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    return count;
  };

  return (
    <DashboardLayout title="Library">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Library Resources</h1>
            <p className="text-sm text-gray-500 mt-1">Search, borrow and track your books</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search books, authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
              />
            </div>
            <div className="relative w-full sm:w-56">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C2B4E] focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowAvailableOnly((prev) => !prev)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                showAvailableOnly
                  ? 'bg-[#0C2B4E] text-white border-[#0C2B4E]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Available Only
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <p className="text-xs text-gray-500">Total Books</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalBooks}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <p className="text-xs text-gray-500">Available Copies</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{totalAvailable}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <p className="text-xs text-gray-500">My Borrowed Books</p>
            <p className="text-2xl font-bold text-[#0C2B4E] mt-1">{totalBorrowedByMe}</p>
          </div>
        </div>

        {/* My Borrowed Books */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookmarkCheck size={20} className="text-[#0C2B4E]" />
            <h2 className="text-lg font-semibold text-gray-900">My Borrowed Books</h2>
          </div>
          {borrowedBooks.length === 0 ? (
            <p className="text-sm text-gray-500">No borrowed books yet.</p>
          ) : (
            <div className="space-y-3">
              {borrowedBooks.map((book) => (
                <div key={book._id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{book.title}</p>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <CalendarClock size={14} />
                      Due: {book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Due policy: ৳10 per day (excluding Friday, Saturday & holidays)
                    </p>
                    <div className="mt-2">
                      {getOverdueDays(book.dueDate) > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                          Overdue: {getOverdueDays(book.dueDate)} days • Due ৳{getOverdueDays(book.dueDate) * 10}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                          No due
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading library resources...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Book className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No books found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <BookOpen className="text-[#1A3D64]" size={32} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {book.category && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-[#E7F0FA] text-[#0C2B4E] rounded">
                          {book.category}
                        </span>
                      )}
                      {book.isEbook && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-[#ECFDF3] text-[#027A48] rounded">
                          eBook
                        </span>
                      )}
                      {book.rating && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                          <Star size={12} className="text-yellow-500" /> {book.rating}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 text-xs text-gray-500 space-y-1">
                      {book.edition && <p>Edition: {book.edition}</p>}
                      {book.year && <p>Year: {book.year}</p>}
                      {book.shelf && <p>Shelf: {book.shelf}</p>}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Available: <span className="font-semibold">{book.availableCopies}/{book.totalCopies}</span>
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        book.availableCopies > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {book.availableCopies > 0 ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Library;
