import React, { useState, useEffect } from 'react';
import CollageLayout from './CollageLayout.jsx';
import MapPageLayout from './MapPageLayout.jsx';

const STORAGE_KEY = 'travelJournal_v1';

const REGIONS = [
  {
    value: 'east-africa',
    label: 'East Africa',
    mapUrl: 'https://www.natureworldwidetravel.com/images/maps/East-Africa.gif'
  },
  {
    value: 'south-america',
    label: 'South America',
    mapUrl: 'https://www.worldatlas.com/r/w1200/upload/1c/0f/1a/shutterstock-712326873.jpg'
  },
  {
    value: 'europe',
    label: 'Europe',
    mapUrl: 'https://www.worldatlas.com/r/w1200/upload/bb/c3/32/shutterstock-1057838449.jpg'
  },
  {
    value: 'southeast-asia',
    label: 'Southeast Asia',
    mapUrl: 'https://www.worldatlas.com/r/w1200/upload/6f/8c/63/shutterstock-1560159711.jpg'
  },
  {
    value: 'north-america',
    label: 'North America',
    mapUrl: 'https://www.worldatlas.com/r/w1200/upload/79/89/28/shutterstock-1001143318.jpg'
  },
  {
    value: 'oceania',
    label: 'Oceania',
    mapUrl: 'https://www.worldatlas.com/r/w1200/upload/c2/24/74/shutterstock-1152363495.jpg'
  }
];

const PHOTO_SIZES = ['small', 'medium', 'large'];

function randomRotation() {
  return Math.floor(Math.random() * 11) - 5;
}

function getMapUrl(region) {
  const found = REGIONS.find(r => r.value === region);
  return found ? found.mapUrl : '';
}

function getRegionLabel(region) {
  const found = REGIONS.find(r => r.value === region);
  return found ? found.label : region;
}

export default function App() {
  const [buildMode, setBuildMode] = useState(true);
  const [viewMode, setViewMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const [journalConfig, setJournalConfig] = useState({
    numberOfPages: 3,
    photosPerPage: 6,
    region: 'east-africa',
    title: 'East African Safari',
    subtitle: 'Kenya & Tanzania Adventure'
  });

  const [pages, setPages] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.pages && parsed.journalConfig) {
          setPages(parsed.pages);
          setJournalConfig(parsed.journalConfig);
          setBuildMode(false);
        }
      } catch (e) {
        console.error('Failed to parse stored journal', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (pages && pages.length > 0) {
      const payload = { pages, journalConfig };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
  }, [pages, journalConfig]);

  const handleBuildJournal = () => {
    const newPages = Array.from({ length: journalConfig.numberOfPages }, (_, i) => {
      const photos = Array.from({ length: journalConfig.photosPerPage }, (__, j) => ({
        id: j + 1,
        url: null,
        caption: `Photo ${j + 1}`,
        size: PHOTO_SIZES[Math.floor(Math.random() * PHOTO_SIZES.length)],
        rotation: randomRotation(),
        x: (j % 3) * 80,
        y: Math.floor(j / 3) * 90,
        zIndex: j + 1
      }));

      return {
        id: i + 1,
        pageType: i === 0 ? 'map' : 'collage',
        locations: [
          { name: `Location ${i * 3 + 1}`, x: 30, y: 60 },
          { name: `Location ${i * 3 + 2}`, x: 50, y: 50 },
          { name: `Location ${i * 3 + 3}`, x: 70, y: 40 }
        ],
        photos,
        narrative: 'Write your travel story here...',
        meta: { year: new Date().getFullYear().toString(), season: 'Spring' }
      };
    });
    setPages(newPages);
    setCurrentPage(0);
    setBuildMode(false);
  };

  const handleImageUpload = (pageIndex, photoIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPages(prev => {
        const newPages = [...prev];
        newPages[pageIndex].photos[photoIndex].url = event.target.result;
        return newPages;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCaptionChange = (pageIndex, photoIndex, caption) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[pageIndex].photos[photoIndex].caption = caption;
      return newPages;
    });
  };

  const handlePositionChange = (pageIndex, photoIndex, x, y) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[pageIndex].photos[photoIndex].x = x;
      newPages[pageIndex].photos[photoIndex].y = y;
      return newPages;
    });
  };

  const handleZIndexChange = (pageIndex, photoIndex, direction) => {
    setPages(prev => {
      const newPages = [...prev];
      const page = newPages[pageIndex];
      const delta = direction === 'up' ? 1 : -1;
      page.photos[photoIndex].zIndex = (page.photos[photoIndex].zIndex || 1) + delta;
      if (page.photos[photoIndex].zIndex < 1) page.photos[photoIndex].zIndex = 1;
      return newPages;
    });
  };

  const handleNarrativeChange = (pageIndex, text) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[pageIndex].narrative = text;
      return newPages;
    });
  };

  const handleLocationNameChange = (pageIndex, locIndex, name) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[pageIndex].locations[locIndex].name = name;
      return newPages;
    });
  };

  const handleAddLocation = (pageIndex) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[pageIndex].locations.push({
        name: 'New Location',
        x: 50,
        y: 50
      });
      return newPages;
    });
  };

  const handleRemoveLocation = (pageIndex, locIndex) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[pageIndex].locations.splice(locIndex, 1);
      return newPages;
    });
  };

  const handlePageTypeChange = (pageIndex, pageType) => {
    setPages(prev => {
      const newPages = [...prev];
      newPages[pageIndex].pageType = pageType;
      return newPages;
    });
  };

  const handleExportJSON = () => {
    if (!pages || pages.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify({ pages, journalConfig }, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'travel-journal.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (parsed.pages && parsed.journalConfig) {
          setPages(parsed.pages);
          setJournalConfig(parsed.journalConfig);
          setBuildMode(false);
          setCurrentPage(0);
        }
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  // Builder screen
  if (buildMode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white/90 rounded-xl shadow-2xl p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⚙️</span>
            <h1 className="text-3xl font-extrabold text-amber-900">
              Build Your Travel Journal
            </h1>
          </div>
          <p className="text-sm text-amber-700">
            Choose your title, region, number of pages, and photos per page. You can switch pages to a collage layout later.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Journal Title
              </label>
              <input
                type="text"
                value={journalConfig.title}
                onChange={(e) =>
                  setJournalConfig({ ...journalConfig, title: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={journalConfig.subtitle}
                onChange={(e) =>
                  setJournalConfig({ ...journalConfig, subtitle: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Region
              </label>
              <select
                value={journalConfig.region}
                onChange={(e) =>
                  setJournalConfig({ ...journalConfig, region: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:border-amber-500 focus:outline-none"
              >
                {REGIONS.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Number of Pages: {journalConfig.numberOfPages}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={journalConfig.numberOfPages}
                onChange={(e) =>
                  setJournalConfig({
                    ...journalConfig,
                    numberOfPages: parseInt(e.target.value, 10)
                  })
                }
                className="w-full"
              />
              <div className="text-xs text-amber-700 mt-1">
                Create {journalConfig.numberOfPages} page
                {journalConfig.numberOfPages > 1 ? 's' : ''} for your journey.
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">
                Photos per Page: {journalConfig.photosPerPage}
              </label>
              <input
                type="range"
                min="3"
                max="9"
                value={journalConfig.photosPerPage}
                onChange={(e) =>
                  setJournalConfig({
                    ...journalConfig,
                    photosPerPage: parseInt(e.target.value, 10)
                  })
                }
                className="w-full"
              />
              <div className="text-xs text-amber-700 mt-1">
                Each page will have {journalConfig.photosPerPage} photo slots.
              </div>
            </div>

            <button
              onClick={handleBuildJournal}
              className="w-full bg-amber-900 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-xl">➕</span>
              Create Journal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Journal view
  const page = pages[currentPage];

  const renderPage = () => {
    if (!page) return null;
    if (page.pageType === 'collage') {
      return (
        <CollageLayout
          page={page}
          pageIndex={currentPage}
          viewMode={viewMode}
          onPhotoUpload={handleImageUpload}
          onCaptionChange={handleCaptionChange}
          onPositionChange={handlePositionChange}
          onZIndexChange={handleZIndexChange}
        />
      );
    }
    // Default: map page
    return (
      <MapPageLayout
        page={page}
        pageIndex={currentPage}
        viewMode={viewMode}
        mapUrl={getMapUrl(journalConfig.region)}
        regionLabel={getRegionLabel(journalConfig.region)}
        onNarrativeChange={handleNarrativeChange}
        onLocationNameChange={handleLocationNameChange}
        onAddLocation={handleAddLocation}
        onRemoveLocation={handleRemoveLocation}
        onPhotoUpload={handleImageUpload}
        onCaptionChange={handleCaptionChange}
      />
    );
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col gap-3 bg-white/95 rounded-xl shadow p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBuildMode(true)}
              className="px-3 py-2 bg-amber-200 text-amber-900 rounded-lg hover:bg-amber-300 text-sm flex items-center gap-1"
            >
              <span>⚙️</span>
              <span>Back to Builder</span>
            </button>
            <button
              onClick={() => setViewMode(v => !v)}
              className="px-3 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800 text-sm flex items-center gap-1"
            >
              <span>{viewMode ? '✏️' : '👁'}</span>
              <span>{viewMode ? 'Edit Mode' : 'Render Mode'}</span>
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-amber-900">
              {journalConfig.title}
            </h2>
            <p className="text-xs md:text-sm text-amber-700">
              {journalConfig.subtitle}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="px-2 py-1 bg-amber-900 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
              >
                ◀
              </button>
              <span className="text-amber-900 font-semibold text-sm min-w-[90px] text-center">
                Page {currentPage + 1} / {pages.length}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))}
                disabled={currentPage === pages.length - 1}
                className="px-2 py-1 bg-amber-900 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
              >
                ▶
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={page.pageType || 'map'}
                onChange={(e) => handlePageTypeChange(currentPage, e.target.value)}
                className="px-2 py-1 border border-amber-300 rounded text-xs"
              >
                <option value="map">Map + Story Page</option>
                <option value="collage">Collage Scrapbook Page</option>
              </select>

              <button
                onClick={handleExportJSON}
                className="px-2 py-1 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-500"
              >
                Export JSON
              </button>

              <label className="px-2 py-1 bg-sky-600 text-white rounded text-xs hover:bg-sky-500 cursor-pointer">
                Import
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {renderPage()}
      </div>
    </div>
  );
}
