require 'rails_helper'
describe Stance do
  describe 'stance choice validation' do
    let(:poll) { create :poll }
    let(:proposal) { create :poll_proposal }
    let(:ranked_choice) { create :poll_ranked_choice }
    let(:user) { create :user }

    before { poll.create_guest_group }

    it 'allows no stance choices for meetings / polls' do
      expect(Stance.new(poll: poll, participant: user)).to be_valid
    end

    it 'requires a stance choice for proposals' do
      expect(Stance.new(poll: proposal, participant: user)).to_not be_valid
    end

    it 'requires a certain number of stance choices to be passed' do
      expect(Stance.new(poll: ranked_choice, participant: user, choice: ['apple'])).to_not be_valid
    end
  end

  describe 'statement' do
    it 'has a length validation' do
      expect(build(:stance, reason: "a"*400)).to_not be_valid
    end
  end

  describe 'choice shorthand' do
    let(:poll) { Poll.create!(poll_type: 'poll', title: 'which pet?', poll_option_names: %w[dog cat], closing_at: 1.day.from_now, author: author)}
    let(:poll_brainstorm) { create :poll_brainstorm, title: 'which pet?', poll_option_names: %w[dog cat] }
    let(:author) { FactoryGirl.create(:user) }

    it "string" do
      stance = Stance.create(poll: poll, participant: author, choice: 'dog')
      poll.update_stance_data
      expect(poll.stance_data).to eq({'dog' => 1, 'cat' => 0})
    end

    it "array" do
      stance = Stance.create(poll: poll, participant: author, choice: ['dog', 'cat'])
      poll.update_stance_data
      expect(poll.stance_data).to eq({'dog' => 1, 'cat' => 1})
    end

    it "map" do
      stance = Stance.create(poll: poll, participant: author, choice: {'dog' => 1, 'cat' => 1})
      poll.update_stance_data
      expect(poll.stance_data).to eq({'dog' => 1, 'cat' => 1})
    end

    it "does not assign new poll options when stances_add_options is false" do
      stance = Stance.create(poll: poll, participant: author, choice: ['dog', 'cat', 'fish'])
      stance_option_names = stance.reload.poll_options.pluck(:name)
      expect(stance_option_names).to include 'cat'
      expect(stance_option_names).to include 'dog'
      expect(stance_option_names).to_not include 'fish'
      expect(poll.reload.poll_option_names).to_not include 'fish'
    end

    it "handles soft creating poll options" do
      stance = Stance.create(poll: poll_brainstorm, participant: author, choice: ['dog', 'cat', 'fish'])
      stance_option_names = stance.reload.poll_options.pluck(:name)
      expect(stance_option_names).to include 'cat'
      expect(stance_option_names).to include 'dog'
      expect(stance_option_names).to include 'fish'
      expect(poll_brainstorm.reload.poll_option_names).to include 'fish'
    end
  end
end
