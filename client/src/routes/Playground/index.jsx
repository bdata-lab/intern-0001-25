import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink, FiSmartphone, FiMonitor, FiDatabase } from 'react-icons/fi'
import data from '../data/data.json'

function App() {
  const [selectedItem, setSelectedItem] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'projects', 'products'

  // Combine all items
  const allItems = [...data.projects, ...data.products]
  
  // Filter items based on selection
  const filteredItems = filter === 'all' 
    ? allItems 
    : filter === 'projects' 
      ? data.projects 
      : data.products

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-6 md:p-12">
      <header className="mb-12">
        
        <div className="flex gap-4 mb-8">
          {['all', 'projects', 'products'].map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === f ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </div>
      </header>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
              <motion.img 
                src={item.images[0]} 
                alt={item.title || item.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-xl font-bold">{item.title || item.name}</h3>
                <p className="text-sm text-gray-300 mt-1">
                  {item.id.startsWith('proj') ? 'Project' : 'Product'}
                </p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-300 mb-3 line-clamp-2">{item.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.techStack.map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.status === 'live' ? 'bg-green-900 text-green-300' :
                  item.status === 'beta' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-blue-900 text-blue-300'
                }`}>
                  {item.status}
                </span>
                <div className="flex gap-2">
                  {item.repoUrl && (
                    <a 
                      href={item.repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-400 hover:text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FiGithub size={18} />
                    </a>
                  )}
                  {(item.liveUrl || item.demoUrl) && (
                    <a 
                      href={item.liveUrl || item.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-400 hover:text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FiExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
                  <img 
                    src={selectedItem.images[0]} 
                    alt={selectedItem.title || selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  className="absolute top-4 right-4 bg-gray-900/50 hover:bg-gray-900 rounded-full p-2"
                  onClick={() => setSelectedItem(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedItem.title || selectedItem.name}</h2>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700">
                        {selectedItem.id.startsWith('proj') ? 'Project' : 'Product'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedItem.status === 'live' ? 'bg-green-900 text-green-300' :
                        selectedItem.status === 'beta' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-blue-900 text-blue-300'
                      }`}>
                        {selectedItem.status}
                      </span>
                      <span className="text-gray-400">{new Date(selectedItem.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {selectedItem.repoUrl && (
                      <a 
                        href={selectedItem.repoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg"
                      >
                        <FiGithub size={20} />
                      </a>
                    )}
                    {(selectedItem.liveUrl || selectedItem.demoUrl) && (
                      <a 
                        href={selectedItem.liveUrl || selectedItem.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg"
                      >
                        <FiExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-gray-300 mb-6">{selectedItem.description}</p>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.techStack.map((tech) => (
                      <motion.span 
                        key={tech}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {'platforms' in selectedItem && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Platforms</h3>
                    <div className="flex gap-3">
                      {selectedItem.platforms.map((platform) => (
                        <div key={platform} className="flex items-center gap-2 text-gray-300">
                          {platform === 'Android' ? <FiSmartphone /> : 
                           platform === 'Web' ? <FiMonitor /> : 
                           platform === 'Desktop' ? <FiMonitor /> : 
                           platform === 'Database' ? <FiDatabase /> : null}
                          <span>{platform}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem.images.length > 1 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Screenshots</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedItem.images.slice(1).map((image, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.03 }}
                          className="rounded-lg overflow-hidden"
                        >
                          <img 
                            src={image} 
                            alt={`Screenshot ${idx + 1}`} 
                            className="w-full h-auto object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App