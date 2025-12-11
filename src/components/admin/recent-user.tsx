
type Users = {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: Date;
};

type RecentUserProps = {
  users: Users[];
}

const RecentUser = ({ users }: RecentUserProps) => {

  if (!users || users.length === 0) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Users</h3>
        <p className="text-gray-400 text-sm">No users found</p>
      </div>
    )
  }


  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Recent Users
      </h3>
      <div className="space-y-3">
        {users.slice(0, 5).map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
          >
            <div>
              <p className="font-medium text-white">{user.name}</p>
              <p className="text-sm text-gray-400 truncate">{user.email}</p>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentUser;
