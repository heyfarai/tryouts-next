'use client';

import { useState, useEffect } from 'react';
import { Toast } from './Toast';
import { useToast } from './useToast';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface User {
  id: string;
  email: string;
  role: string;
  isLead: boolean;
  leadSource?: string;
  createdAt: string;
  guardian?: {
    id: string;
    phone?: string;
  };
  player?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface Guardian {
  id: string;
  user: {
    email: string;
    createdAt: string;
  };
  phone?: string;
  players: Array<{
    id: string;
    firstName: string;
    lastName: string;
  }>;
  registrations: Array<{
    id: string;
    tryoutName: string;
    status: string;
    createdAt: string;
  }>;
}

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
  user?: {
    email: string;
  };
  guardian: {
    user: {
      email: string;
    };
  };
  registrations: Array<{
    registration: {
      tryoutName: string;
      status: string;
      createdAt: string;
    };
  }>;
}

interface Registration {
  id: string;
  tryoutName: string;
  status: string;
  createdAt: string;
  guardian: {
    user: {
      email: string;
    };
  };
  players: Array<{
    player: {
      firstName: string;
      lastName: string;
    };
  }>;
  payment?: {
    amount: number;
    status: string;
  };
}

type TabType = 'users' | 'guardians' | 'players' | 'registrations';

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState<{show: boolean, type: TabType, id: string, name: string}>({show: false, type: 'users', id: '', name: ''});
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const fetchData = async (type: TabType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      switch (type) {
        case 'users':
          setUsers(data);
          break;
        case 'guardians':
          setGuardians(data);
          break;
        case 'players':
          setPlayers(data);
          break;
        case 'registrations':
          setRegistrations(data);
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const showDeleteModal = (type: TabType, id: string, name: string) => {
    setDeleteModal({ show: true, type, id, name });
  };

  const confirmDelete = async () => {
    const { type, id } = deleteModal;
    console.log(`Attempting to delete ${type} with id:`, id);

    try {
      const token = localStorage.getItem('adminToken');
      console.log('Using token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(`/api/admin/${type}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete response status:', response.status);
      
      if (response.ok) {
        console.log('Delete successful, refreshing data');
        await fetchData(activeTab);
        setDeleteModal({ show: false, type: 'users', id: '', name: '' });
        showSuccess('Item deleted successfully!', `${deleteModal.name} has been removed from the system.`);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Delete failed:', errorData);
        showError('Failed to delete item', errorData.error || 'Unknown error occurred while deleting the item.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showError('Delete operation failed', error instanceof Error ? error.message : 'An unexpected error occurred.');
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, type: 'users', id: '', name: '' });
  };

  const markRegistrationComplete = async (playerId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/players/${playerId}/complete-registration`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchData(activeTab);
        showSuccess('Registration marked complete!', 'Player registration has been updated to completed status.');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        showError('Failed to mark registration complete', errorData.error || 'Unknown error occurred.');
      }
    } catch (error) {
      console.error('Mark complete error:', error);
      showError('Operation failed', error instanceof Error ? error.message : 'An unexpected error occurred.');
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'leads') return user.isLead;
    if (filter === 'guardians') return user.role === 'GUARDIAN';
    if (filter === 'players') return user.role === 'PLAYER';
    if (filter === 'admins') return user.role === 'ADMIN';
    return true;
  });

  const filteredRegistrations = registrations.filter(reg => {
    if (filter === 'all') return true;
    if (filter === 'completed') return reg.status === 'COMPLETED';
    if (filter === 'pending') return reg.status === 'PENDING_PAYMENT';
    if (filter === 'abandoned') return reg.status === 'ABANDONED';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'users', label: 'Users', count: users.length },
              { key: 'guardians', label: 'Guardians', count: guardians.length },
              { key: 'players', label: 'Players', count: players.length },
              { key: 'registrations', label: 'Registrations', count: registrations.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabType)}
                className={`${
                  activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.label}</span>
                <span className="bg-gray-100 text-gray-900 rounded-full px-2.5 py-0.5 text-xs font-medium">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">All {activeTab}</option>
            {activeTab === 'users' && (
              <>
                <option value="leads">Leads Only</option>
                <option value="guardians">Guardians Only</option>
                <option value="players">Players Only</option>
                <option value="admins">Admins Only</option>
              </>
            )}
            {activeTab === 'registrations' && (
              <>
                <option value="completed">Completed</option>
                <option value="pending">Pending Payment</option>
                <option value="abandoned">Abandoned</option>
              </>
            )}
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg">Loading...</div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lead Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'GUARDIAN' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'PLAYER' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.isLead ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Lead {user.leadSource && `(${user.leadSource})`}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => showDeleteModal('users', user.id, user.email)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Guardians Tab */}
            {activeTab === 'guardians' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Players
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registrations
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {guardians.map((guardian) => (
                      <tr key={guardian.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {guardian.user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {guardian.phone || <span className="text-gray-400">-</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {guardian.players.length} player{guardian.players.length !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {guardian.registrations.length} registration{guardian.registrations.length !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(guardian.user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => showDeleteModal('guardians', guardian.id, guardian.user.email)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Players Tab */}
            {activeTab === 'players' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date of Birth
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gender
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guardian
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Player Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registrations
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {players.map((player) => (
                      <tr key={player.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {player.firstName} {player.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(player.birthdate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            player.gender.toLowerCase() === 'male' ? 'bg-blue-100 text-blue-800' :
                            player.gender.toLowerCase() === 'female' ? 'bg-pink-100 text-pink-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {player.gender}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {player.guardian.user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {player.user?.email || <span className="text-gray-400">-</span>}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="space-y-1">
                            {player.registrations.map((reg) => (
                              <div key={reg.registration.tryoutName + reg.registration.createdAt} className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                  reg.registration.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                  reg.registration.status === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {reg.registration.status.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-gray-400 font-mono">
                                  ID: {reg.registration.tryoutName.includes('Walk-in') ? 'WALK-IN' : 'REG'}-{reg.registration.createdAt.slice(-8, -4)}
                                </span>
                              </div>
                            ))}
                            {player.registrations.length === 0 && (
                              <span className="text-gray-400 text-xs">No registrations</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-4">
                            {player.registrations.some(reg => reg.registration.status === 'PENDING_PAYMENT') && (
                              <button
                                onClick={() => markRegistrationComplete(player.id)}
                                className="text-green-600 hover:text-green-900 hover:underline"
                              >
                                Mark Complete
                              </button>
                            )}
                            <button
                              onClick={() => showDeleteModal('players', player.id, `${player.firstName} ${player.lastName}`)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Registrations Tab */}
            {activeTab === 'registrations' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tryout Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guardian
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Players
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRegistrations.map((registration) => (
                      <tr key={registration.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {registration.tryoutName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {registration.guardian.user.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="max-w-xs">
                            {registration.players.map((p, index) => (
                              <span key={p.player.firstName + p.player.lastName} className="inline-block">
                                {p.player.firstName} {p.player.lastName}
                                {index < registration.players.length - 1 && ', '}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            registration.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            registration.status === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {registration.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {registration.payment ? (
                            <div>
                              <div className="font-medium">${(registration.payment.amount / 100).toFixed(2)}</div>
                              <div className="text-xs text-gray-400">{registration.payment.status}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(registration.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => showDeleteModal('registrations', registration.id, registration.tryoutName)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State */}
            {((activeTab === 'users' && filteredUsers.length === 0) ||
              (activeTab === 'guardians' && guardians.length === 0) ||
              (activeTab === 'players' && players.length === 0) ||
              (activeTab === 'registrations' && filteredRegistrations.length === 0)) && (
              <div className="text-center py-12">
                <p className="text-gray-500">No {activeTab} found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Delete {deleteModal.type.slice(0, -1)}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete <strong>{deleteModal.name}</strong>?
                  This action cannot be undone and will also delete all related records.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
