class Events::UserReactivated < Event
  include Events::Notify::ByEmail

  def self.publish!(user)
    super user, user: user
  end

  def email_users!
    eventable.send(:mailer).delay(priority: 1).send(email_method, user, self)
  end

end
