module ExamplePollService
  def self.cleanup
    Poll.where(example: true).where('created_at < ?', 1.day.ago).destroy_all
    User.where('email ilike ?', '%@example.com').where('memberships_count = 1').where('created_at < ?', 1.day.ago).destroy_all
  end
end
