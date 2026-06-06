import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from 'react-js-loader';

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = localStorage.getItem('tokenUser');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  const handleLogout = async (
    e: React.MouseEvent<HTMLAnchorElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenUser');
      setIsLoggedIn(false);
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  const handleDelete = () => setShowDeleteModal(true);

  const confirmDelete = async (): Promise<void> => {
    if (!user) return;
    setLoading(true);

    try {
      await fetch(`http://localhost:4000/delete-user/${user}`, {
        method: 'DELETE',
      });

      localStorage.clear();
      setIsLoggedIn(false);
      navigate('/login');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleRestrictedClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    isLoggedIn ? navigate(path) : navigate('/login');
  };

  return (
    <>
      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <Loader type="spinner-default" bgColor="#ec4899" size={60} />
        </div>
      )}

      <header className="fixed top-0 left-0 w-full z-40 shadow-md bg-pink-100">
        <nav className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img
              src="/images/meditation.jpg"
              alt="Logo"
              className="h-10 w-10 rounded-full"
            />
            <span className="font-bold text-lg">MindfulMe</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-8">
            <a
              href="#"
              onClick={(e) => handleRestrictedClick(e, `/${user}/mood`)}
              className="font-semibold"
            >
              Mood Tracker
            </a>
            <a
              href="#"
              onClick={(e) => handleRestrictedClick(e, `/${user}/therapist`)}
              className="font-semibold"
            >
              AI Therapist
            </a>
            <a
              href="#"
              onClick={(e) => handleRestrictedClick(e, `/${user}/quiz`)}
              className="font-semibold"
            >
              Quiz
            </a>
            <a href="/aboutus" className="font-semibold">
              About Us
            </a>
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex">
            {isLoggedIn ? (
              <div className="relative">
                <button onClick={toggleDropdown}>
                  <img
                    src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg"
                    className="h-9 w-9 rounded-full"
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white rounded shadow-md w-40">
                    <a
                      href={`/${user}/profile`}
                      className="block px-4 py-2"
                    >
                      Profile
                    </a>
                    <a
                      href="#"
                      onClick={handleLogout}
                      className="block px-4 py-2"
                    >
                      Logout
                    </a>
                    <a
                      href="#"
                      onClick={handleDelete}
                      className="block px-4 py-2 text-red-600"
                    >
                      Delete Account
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="font-semibold"
              >
                Login →
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={toggleMobileMenu}
          >
            ☰
          </button>
        </nav>
      </header>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold">Delete Profile</h3>
            <p className="mt-2 text-sm text-gray-600">
              This action is irreversible.
            </p>
            <div className="mt-4 flex gap-2 justify-end">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
