=begin
  KGC Stat Distribution [VX Ace]
  Version: 1.0.0
  By: KGC: http://ytomy.sakura.ne.jp/tkool/rpgtech/techlist_vxace.html
  Modified/Translated: theJragyn

  This script will enable you to gain points per level and distribute them into
  "keys" that will further to increase/decrease stats (on top of the level-up
  stats if you choose to use those too).
  
  KGC wrote the script, but I added in functionality for more than just the base
  parameters, again like EX/SP parameters, to accomodate the need to raise stats
  like TGR/GRD for the J XAS Compilation.
  
      --theJragyn
=end
module KMS_DistributeParameter
    # ◆ Parameter Key Setup
    #   {
    #     :key        => This whole thing is called "a key".
    #     :name       => What the player will see ingame.
    #     :limit      => The max amount of times you can raise it, 0 for infinity.
    #     :cost       => [base RP, RP-increase per level],
    #     :param. => [base param., param-growth per level],
    #     # you can put multiple params. so one ":key" can affect many stats.
    #   },
    
  #~   PARAMS = [:mhp, :mmp, :atk, :def, :mat, :mdf, :agi, :luk,
  #~                 :skill_speed, :item_speed]
  #~   PARAMS |= [:hit, :eva, :cri, :cev, :mev, :mrf, :cnt, :hrg, :mrg, :trg]
  #~   PARAMS |= [:tgr, :grd, :rec, :pha, :mcr, :tcr, :pdr, :mdr, :fdr, :exr]
  
  #  This is for all actors and classes.
    GAIN_PARAMETER = [
  #~       {
  #~       :key   => :mhp,
  #~       :name  => "hp",
  #~       :limit => 30,
  #~       :cost  => [ 1, 0.4],
  #~       :mhp   => [50, 3],
  #~       :def   => [ 1, 0.3],
  #~       },
  #~     ]
    ]  # < Don't delete this line.
  
    # This is for specific actors.
    # the number in the [ ] is the ACTOR_ID in the database.
    PERSONAL_GAIN_PARAMETER = [] 
    PERSONAL_GAIN_PARAMETER << PERSONAL_GAIN_PARAMETER[0] = [] # default, aka none
  #~   PERSONAL_GAIN_PARAMETER << PERSONAL_GAIN_PARAMETER[1] = [
  #~       {
  #~       :key   => :mhp,
  #~       :name  => "hp",
  #~       :limit => 30,
  #~       :cost  => [ 1, 0.4],
  #~       :mhp   => [50, 3],
  #~       :def   => [ 1, 0.3],
  #~       },
  #~     ]
    
    CLASS_GAIN_PARAMETER = []
    #  Same thing as above, but for classes instead of actors.
    #  This will enable you, the dev, to make different stat growths per class.
       CLASS_GAIN_PARAMETER << CLASS_GAIN_PARAMETER[0] = [] # default, aka none.
       CLASS_GAIN_PARAMETER << CLASS_GAIN_PARAMETER[1] = [ # Fighter
      {
        :key   => :health,  :name  => "Health Boost",:limit => 25,  :cost  => [1],
        :mhp   => [15],
        :mmp   => [2],
        :def   => [1],
        :mdf   => [0.6],
        :atk   => [0.2],
        :mat   => [0.2],
        :luk   => [0.2],
      },
      {
        :key   => :spirit,  :name  => "Spirit Expand",:limit => 10, :cost  => [1],
        :mhp   => [2],
        :mmp   => [15],
        :def   => [0.6],
        :mdf   => [1],
        :atk   => [0.2],
        :mat   => [0.2],
        :luk   => [0.2],
      },
      {
        :key   => :pow,     :name  => "Power Blows",  :limit => 30, :cost  => [1],
        :mhp   => [3],
        :mmp   => [1],
        :atk   => [2.5],
        :mat   => [0.6],
        :tgr   => [0.01],
        :def   => [0.2],
        :mdf   => [0.2],
        :luk   => [0.2],
      },
      {
        :key   => :end,     :name  => "Endurance Up", :limit => 30, :cost  => [1],
        :mhp   => [6],
        :mmp   => [2],
        :def   => [2],
        :mdf   => [0.6],
        :grd   => [0.03],
        :atk   => [0.2],
        :mat   => [0.2],
        :luk   => [0.2],
      },
      {
        :key   => :for,     :name  => "Force Focus",  :limit => 15, :cost  => [1],
        :mhp   => [1],
        :mmp   => [3],
        :atk   => [0.6],
        :mat   => [2.5],
        :def   => [0.2],
        :mdf   => [0.2],
        :luk   => [0.2],
      },
      {
        :key   => :res,     :name  => "Resist Magic", :limit => 20, :cost  => [1],
        :mhp   => [2],
        :mmp   => [6],
        :def   => [0.6],
        :mdf   => [2.5],
        :atk   => [0.2],
        :mat   => [0.2],
        :luk   => [0.2],
        :grd   => [0.01],
      },
      {
        :key   => :luk,     :name  => "Good Fortune", :limit => 10, :cost  => [1],
        :mhp   => [2],
        :mmp   => [2],
        :luk   => [1],
        :hit   => [0.007],
        :cri   => [0.002],
        :tgr   => [0.01],
        :grd   => [0.01],
        :exr   => [0.01],
        :atk   => [0.1],
        :mat   => [0.1],
        :def   => [0.1],
        :mdf   => [0.1],
        :luk   => [0.1],
      },
      {
        :key   => :f_,  :name  => "Fighter's Edge",   :limit => 50, :cost  => [1],
        :mhp   => [4],
        :mmp   => [2],
        :atk   => [1.2],
        :def   => [0.7],
        :cri   => [0.004],
        :tgr   => [0.01],
        :grd   => [0.01],
        :mat   => [0.2],
        :mdf   => [0.2],
        :luk   => [0.1],
      },
       ]
       CLASS_GAIN_PARAMETER << CLASS_GAIN_PARAMETER[2] = [ # Acolyte
      {
        :key   => :health,:name  => "Health Boost",   :limit => 15, :cost  => [1],
        :mhp   => [15],
        :mmp   => [2],
        :def   => [1],
        :mdf   => [0.6],
        :atk   => [0.2],
        :mat   => [0.2],
        :luk   => [0.2],
      },
      {
        :key   => :spirit,:name  => "Spirit Expand",  :limit => 30, :cost  => [1],
        :mhp   => [2],
        :mmp   => [15],
        :def   => [0.6],
        :mdf   => [1],
        :atk   => [0.2],
        :mat   => [0.2],
        :luk   => [0.2],
      },
      {
        :key   => :pow,   :name  => "Power Blows",    :limit => 10, :cost  => [1],
        :mhp   => [3],
        :mmp   => [1],
        :atk   => [2.5],
        :mat   => [0.6],
        :tgr   => [0.01],
        :def   => [0.2],
        :mdf   => [0.2],
        :luk   => [0.2],
      },
      {
        :key   => :end,   :name  => "Endurance Up",   :limit => 15, :cost  => [1],
        :mhp   => [6],
        :mmp   => [2],
        :def   => [2],
        :mdf   => [0.6],
        :grd   => [0.03],
        :atk   => [0.2],
        :mat   => [0.2],
        :luk   => [0.2],
      },
      {
        :key   => :for,    :name  => "Force Focus",   :limit => 40, :cost  => [1],
        :mhp   => [1],
        :mmp   => [3],
        :atk   => [0.6],
        :mat   => [2.5],
        :def   => [0.2],
        :mdf   => [0.2],
        :luk   => [0.2],
      },
      {
        :key   => :res,   :name  => "Resist Magic",   :limit => 30, :cost  => [1],
        :mhp   => [2],
        :mmp   => [6],
        :def   => [0.6],
        :mdf   => [2.5],
        :atk   => [0.2],
        :mat   => [0.2],
        :luk   => [0.2],
        :grd   => [0.01],
      },
      {
        :key   => :luk,  :name  => "Good Fortune",    :limit => 15, :cost  => [1],
        :mhp   => [2],
        :mmp   => [2],
        :luk   => [1],
        :hit   => [0.007],
        :cri   => [0.002],
        :tgr   => [0.01],
        :grd   => [0.01],
        :exr   => [0.01],
        :atk   => [0.1],
        :mat   => [0.1],
        :def   => [0.1],
        :mdf   => [0.1],
        :luk   => [0.1],
      },
      {
        :key   => :m_,  :name  => "Acolyte's Mind",:limit => 50,:cost  => [1],
        :mhp   => [2],
        :mmp   => [4],
        :mat   => [1.2],
        :mdf   => [1.2],
        :cri   => [0.004],
        :grd   => [0.03],
        :atk   => [0.2],
        :def   => [0.2],
        :luk   => [0.1],
      },
       ]
  
    # ◆ RP Name
    VOCAB_RP   = "Cost"
    # ◆ RP Abbreviation
    VOCAB_RP_A = "RP"
  
    # ◆ MaxRP Formula
    #   level = the leve of the character
    #  This controls the max amount of RP the character can have.
    # Ultimately, we will be controlling this, as this essentially grants
    # the player more points to use to modify their stats.
  #~   MAXRP_EXP = "(level ** 0.25 + 4.0) * level"
    MAXRP_EXP = "((level ** 0.25 + 5.0) * (level * 0.55))"
  
    # ◆ Parameter function and names
    #  The parameters and their names that are handled by this script.
    VOCAB_PARAM = {
      :hit         => "Accuracy",
      :eva         => "Evade Rate",
      :grd         => "Parry Rate",
      :cri         => "Crit Rate",
      :cev         => "Crit Block",
      :mev         => "M-Evade",
      :mrf         => "M-Reflect%",
      :cnt         => "Counter",
      :hrg         => "HP Regen%",
      :mrg         => "MP Regen%",
      :trg         => "TP Regen",
      :rec         => "Heal Rate%",
      :pha         => "Item Use%",
      :mcr         => "MP Cost%",
      :tcr         => "TP Charge",
      :pdr         => "P-DMG Rate%",
      :mdr         => "M-DMG Rate%",
      :fdr         => "Floor Damage%",
      :exr         => "EXP Rate%",
      :skill_speed => "Skill Speed",
      :item_speed  => "Item Speed",
      :tgr         => "Pierce Rate",
    }  # << Don't delete this.
  
    #  true  : will only show the current RP level
    #  false : Will show  / --- if there is no max.
    HIDE_MAX_COUNT_INFINITE  = true
  
    #  System Colors    : \C[n] is the number it corresponds to for colors
    #  Color.new(x,y,z) : Color.new(255, 128, 128) procedure for new colors
    GAUGE_START_COLOR = 28
    GAUGE_END_COLOR   = 29
    
    #  Utilizes the gauge script by KGC
    ENABLE_GENERIC_GAUGE = false
  
    # "Graphics/System" is the path of where this gauge will be
    GAUGE_IMAGE  = "GaugeDist"  # The name of the file
    GAUGE_OFFSET = [-23, -2]    # [x, y] difference
    GAUGE_LENGTH = -4           # How long the 
    GAUGE_SLOPE  = 30           # The degree of the slope (-89 ~ 89)
  
    # ◆ The command window that appears when cancelling or accepting changes.
    CONFIRM_COMMANDS = [
      "　Accept",  # Accept command
      "　Denied",  # Don't accept command
      "　Cancel",  # Go back.
    ]  # << Don't delete this.
    
    # ◆ The help window that appears when cancelling or accepting changes.
    CONFIRM_COMMAND_HELP = [
      "Accept all changes made and move on.",
      "Move on without making any changes.",
      "Go back to the distribution screen.",
    ]  # << Don't delete this.
  
    # ◆ The width of the confirmation command window
    CONFIRM_WIDTH = 162
  
    # Enable Menu add-in command for KGC Distribution
    # Name of the menu command if you add it in.
    USE_MENU_DISTRIBUTE_PARAMETER_COMMAND = false
    VOCAB_MENU_DISTRIBUTE_PARAMETER       = "Distribute"
  
    ENABLE_REVERSE_DISTRIBUTE = false
    #  true  : You can go back and and change the RP distribution anytime.
    #  false : Will prevent you from changing RP distribution AFTER distributed.
  end
  
  #==============================================================================
  # ☆ 設定ここまで - END Setting ☆
  #==============================================================================
  
  $kms_imported = {} if $kms_imported == nil
  $kms_imported["DistributeParameter"] = true
  
  
  module KMS_DistributeParameter
    # 振り分け対象パラメータ
    PARAMS = [:mhp, :mmp, :atk, :def, :mat, :mdf, :agi, :luk, :hit, :eva, :cri]
      #, :skill_speed, :item_speed, :tgr]
  #~   PARAMS |= [:hit, :eva, :cri, :cev, :mev, :mrf, :cnt, :hrg, :mrg, :trg]
  #~   PARAMS |= [:tgr, :grd, :rec, :pha, :mcr, :tcr, :pdr, :mdr, :fdr, :exr]
    ##16:9##
  #  PARAMS |= [:hit, :eva, :tgr, :grd, :cri, :cev, :mev, :mrf, :hrg, :mrg]
  #  PARAMS |= [:rec, :pha, :mcr, :pdr, :mdr, :exr]
    PARAMS |= [:hit, :eva, :tgr, :grd, :cri, :mrf, :rec, :mcr, :exr]
  
    # パラメータ増加量構造体
    GainInfo  = Struct.new(:key, :name, :limit, :cost, :cost_rev, :params)
    ParamInfo = Struct.new(:value, :value_rev)
  
    # 振り分け情報構造体
    DistInfo = Struct.new(:count, :hp, :mp)
  
    #--------------------------------------------------------------------------
    # ○ パラメータ増加量を構造体化
    #--------------------------------------------------------------------------
    def self.create_gain_param_structs(target)
      result = []
      target.each { |v|
        info = GainInfo.new
        info.key      = v[:key]
        info.name     = v[:name]
        info.limit    = v[:limit]
        info.cost     = v[:cost][0]
        info.cost_rev = (v[:cost][1] == nil ? 0 : v[:cost][1])
        info.params   = {}
  
        PARAMS.each { |param|
          next unless v.has_key?(param)
          pinfo = ParamInfo.new
          pinfo.value     = v[param][0]
          pinfo.value_rev = (v[param][1] == nil ? 0 : v[param][1])
          info.params[param] = pinfo
        }
        result << info
      }
      return result
    end
    #--------------------------------------------------------------------------
    # ○ パラメータ増加量を構造体化 (固有増加量用)
    #--------------------------------------------------------------------------
    def self.create_gain_param_structs_for_personal(target)
      result = []
      target.each { |list|
        next if list == nil
        result << create_gain_param_structs(list)
      }
      return result
    end
    #--------------------------------------------------------------------------
    # ○ パラメータ増加量を併合
    #--------------------------------------------------------------------------
    def self.merge(list1, list2)
      result = list1.clone
      list2.each { |info2|
        overwrite = false
        list1.each_with_index { |info1, i|
          if info1.key == info2.key
            result[i] = info2
            overwrite = true
            break
          end
        }
        result << info2 unless overwrite
      }
      return result
    end
  
    # パラメータ増加量を構造体化
    GAIN_PARAMS = create_gain_param_structs(GAIN_PARAMETER)
    PERSONAL_GAIN_PARAMS =
      create_gain_param_structs_for_personal(PERSONAL_GAIN_PARAMETER)
    CLASS_GAIN_PARAMS =
      create_gain_param_structs_for_personal(CLASS_GAIN_PARAMETER)
  end
  
  #★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★
  
  #==============================================================================
  # ■ Vocab
  #==============================================================================
  
  module Vocab
    # 命中率
    def self.hit
      return KMS_DistributeParameter::VOCAB_PARAM[:hit]
    end
  
    # 回避率
    def self.eva
      return KMS_DistributeParameter::VOCAB_PARAM[:eva]
    end
  
    # クリティカル率
    def self.cri
      return KMS_DistributeParameter::VOCAB_PARAM[:cri]
    end
    
    # クリティカル率
    def self.cev
      return KMS_DistributeParameter::VOCAB_PARAM[:cev]
    end
    
    # クリティカル率
    def self.mev
      return KMS_DistributeParameter::VOCAB_PARAM[:mev]
    end
    
    # クリティカル率
    def self.mrf
      return KMS_DistributeParameter::VOCAB_PARAM[:mrf]
    end
    
    # クリティカル率
    def self.cnt
      return KMS_DistributeParameter::VOCAB_PARAM[:cnt]
    end
    
    # クリティカル率
    def self.hrg
      return KMS_DistributeParameter::VOCAB_PARAM[:hrg]
    end
    
    # クリティカル率
    def self.mrg
      return KMS_DistributeParameter::VOCAB_PARAM[:mrg]
    end
    
    # クリティカル率
    def self.trg
      return KMS_DistributeParameter::VOCAB_PARAM[:trg]
    end
  
    # スキル速度補正
    def self.skill_speed
      return KMS_DistributeParameter::VOCAB_PARAM[:skill_speed]
    end
  
    # アイテム速度補正
    def self.item_speed
      return KMS_DistributeParameter::VOCAB_PARAM[:item_speed]
    end
  
    # 狙われやすさ
    def self.tgr
      return KMS_DistributeParameter::VOCAB_PARAM[:tgr]
    end
  
    # 狙われやすさ
    def self.grd
      return KMS_DistributeParameter::VOCAB_PARAM[:grd]
    end
  
    # 狙われやすさ
    def self.rec
      return KMS_DistributeParameter::VOCAB_PARAM[:rec]
    end
  
    # 狙われやすさ
    def self.pha
      return KMS_DistributeParameter::VOCAB_PARAM[:pha]
    end
  
    # 狙われやすさ
    def self.mcr
      return KMS_DistributeParameter::VOCAB_PARAM[:mcr]
    end
  
    # 狙われやすさ
    def self.tcr
      return KMS_DistributeParameter::VOCAB_PARAM[:tcr]
    end
  
    # 狙われやすさ
    def self.pdr
      return KMS_DistributeParameter::VOCAB_PARAM[:pdr]
    end
  
    # 狙われやすさ
    def self.mdr
      return KMS_DistributeParameter::VOCAB_PARAM[:mdr]
    end
  
    # 狙われやすさ
    def self.fdr
      return KMS_DistributeParameter::VOCAB_PARAM[:fdr]
    end
  
    # 狙われやすさ
    def self.exr
      return KMS_DistributeParameter::VOCAB_PARAM[:exr]
    end
  
    # RP
    def self.rp
      return KMS_DistributeParameter::VOCAB_RP
    end
  
    # RP (略)
    def self.rp_a
      return KMS_DistributeParameter::VOCAB_RP_A
    end
  
    # パラメータ振り分け
    def self.distribute_parameter
      return KMS_DistributeParameter::VOCAB_MENU_DISTRIBUTE_PARAMETER
    end
  end
  
  #★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★
  
  #==============================================================================
  # ■ DataManager
  #==============================================================================
  
  module DataManager
    module_function
    #--------------------------------------------------------------------------
    # ● セーブ内容の展開
    #--------------------------------------------------------------------------
    class << DataManager
      unless method_defined?(:extract_save_contents_KMS_DistributeParameter)
        alias extract_save_contents_KMS_DistributeParameter extract_save_contents
      end
    end
    def extract_save_contents(contents)
      extract_save_contents_KMS_DistributeParameter(contents)
  
      KMS_Commands.check_distribution_values
      Graphics.frame_reset
    end
  end
  
  #★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★
  
  #==============================================================================
  # □ KMS_Commands
  #==============================================================================
  
  module KMS_Commands
    module_function
    #--------------------------------------------------------------------------
    # ○ パラメータ振り分けに関する値をチェック
    #--------------------------------------------------------------------------
    def check_distribution_values
      (1...$data_actors.size).each { |i|
        actor = $game_actors[i]
        actor.check_distribution_values
        actor.restore_distribution_values
      }
    end
    #--------------------------------------------------------------------------
    # ○ RP の増減
    #     actor_id : アクター ID
    #     value    : 増減量
    #--------------------------------------------------------------------------
    def gain_rp(actor_id, value)
      actor = $game_actors[actor_id]
      return if actor == nil
      actor.gain_rp(value)
    end
    #--------------------------------------------------------------------------
    # ○ 振り分けの実行
    #     actor_id : アクター ID
    #     key      : 対象パラメータのキー
    #     num      : 振り分け回数
    #--------------------------------------------------------------------------
    def distribute_param_actor(actor_id, key, num = 1)
      actor = $game_actors[actor_id]
      return if actor == nil
  
      # 逆加算判定
      reverse = false
      if num < 0
        reverse = true
        num = num.abs
      end
  
      # 適用
      num.times { |i| actor.rp_growth_effect(key, reverse) }
    end
    #--------------------------------------------------------------------------
    # ○ 振り分け回数をリセット
    #     actor_id : アクター ID
    #--------------------------------------------------------------------------
    def reset_distributed_count(actor_id)
      actor = $game_actors[actor_id]
      return if actor == nil
      actor.clear_distribution_values
      actor.restore_distribution_values
    end
    #--------------------------------------------------------------------------
    # ○ パラメータ振り分け画面の呼び出し
    #     actor_index : アクターインデックス
    #--------------------------------------------------------------------------
    def call_distribute_parameter(actor_index = 0)
      return if $game_party.in_battle
      $game_temp.call_distribute_parameter = true
      $game_party.menu_actor = $game_party.members[actor_index]
    end
  end
  
  class Game_Interpreter
    include KMS_Commands
  end
  
  #★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★
  
  #==============================================================================
  # ■ Game_Temp
  #==============================================================================
  
  class Game_Temp
    #--------------------------------------------------------------------------
    # ● 公開インスタンス変数
    #--------------------------------------------------------------------------
    attr_accessor :call_distribute_parameter  # 振り分け画面呼び出しフラグ
    attr_accessor :menu_actor_index           # 各種メニュー画面用のアクター index
    #--------------------------------------------------------------------------
    # ● オブジェクト初期化
    #--------------------------------------------------------------------------
    alias initialize_KMS_DistributeParameter initialize
    def initialize
      initialize_KMS_DistributeParameter
  
      @call_distribute_parameter = false
      @menu_actor_index = 0
    end
  end
  
  #★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★
  
  #==============================================================================
  # ■ Game_BattlerBase
  #==============================================================================
  
  class Game_BattlerBase
    #--------------------------------------------------------------------------
    # ● 能力値に加算する値をクリア
    #--------------------------------------------------------------------------
    alias clear_param_plus_KMS_DistributeParameter clear_param_plus
    def clear_param_plus
      clear_param_plus_KMS_DistributeParameter
  
      clear_distribution_values
      calc_distribution_values
    end
    #--------------------------------------------------------------------------
    # ○ パラメータ振り分けに関する値をクリア
    #--------------------------------------------------------------------------
    def clear_distribution_values
      @distributed_count = {}
      KMS_DistributeParameter::PARAMS.each { |param|
        @distributed_count[param] = 0
      }
    end
    #--------------------------------------------------------------------------
    # ○ パラメータ振り分けに関する値をチェック
    #--------------------------------------------------------------------------
    def check_distribution_values
      last_distributed_count = @distributed_count
  
      clear_distribution_values
  
      @distributed_count = last_distributed_count if last_distributed_count != nil
    end
    #--------------------------------------------------------------------------
    # ○ 各種修正値を計算
    #--------------------------------------------------------------------------
    def calc_distribution_values
      # 継承先で定義
    end
    #--------------------------------------------------------------------------
    # ○ 振り分けによる上昇値を取得
    #     param : パラメータの Symbol
    #--------------------------------------------------------------------------
    def distributed_param(param)
      return 0
    end
    #--------------------------------------------------------------------------
    # ○ 振り分けに関する情報を取得
    #--------------------------------------------------------------------------
    def distribution_info
      info = KMS_DistributeParameter::DistInfo.new
      info.count = @distributed_count.clone
      info.hp    = self.hp
      info.mp    = self.mp
      return info
    end
    #--------------------------------------------------------------------------
    # ○ 振り分けに関する情報を設定
    #--------------------------------------------------------------------------
    def set_distribution_info(info)
      return unless info.is_a?(KMS_DistributeParameter::DistInfo)
  
      @distributed_count = info.count
      calc_distribution_values
      self.hp = info.hp
      self.mp = info.mp
    end
  end
  
  #★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★
  
  #==============================================================================
  # ■ Game_Action
  #==============================================================================
  
  class Game_Action
    #--------------------------------------------------------------------------
    # ● 行動速度の計算
    #--------------------------------------------------------------------------
    alias speed_KMS_DistributeParameter speed
    def speed
      speed = speed_KMS_DistributeParameter
      return speed if attack?
  
      if item.is_a?(RPG::Skill) && item.speed < 0
        n = [subject.distributed_param(:skill_speed), item.speed.abs].min
        speed += n
      elsif item.is_a?(RPG::Item) && item.speed < 0
        n = [subject.distributed_param(:item_speed), item.speed.abs].min
        speed += n
      end
  
      return speed
    end
  end
  
  #★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★
  
  #==============================================================================
  # ■ Game_Actor
  #==============================================================================
  
  class Game_Actor < Game_Battler
    #--------------------------------------------------------------------------
    # ○ クラス変数
    #--------------------------------------------------------------------------
    @@__distribute_gain_params = {}
    #--------------------------------------------------------------------------
    # ● オブジェクト初期化
    #     actor_id : アクター ID
    #--------------------------------------------------------------------------
    alias initialize_KMS_DistributeParameter initialize
    def initialize(actor_id)
      @actor_id = actor_id
      @class_id = actor.class_id
  
      initialize_KMS_DistributeParameter(actor_id)
    end
    #--------------------------------------------------------------------------
    # ○ パラメータ増加量一覧を取得
    #--------------------------------------------------------------------------
    def gain_parameter_list
      key = "#{@actor_id}_#{@class_id}"
      unless @@__distribute_gain_params.has_key?(key)
        result = KMS_DistributeParameter::GAIN_PARAMS
  
        # アクター固有
        list   = KMS_DistributeParameter::PERSONAL_GAIN_PARAMS[@actor_id]
        result = KMS_DistributeParameter.merge(result, list) if list != nil
  
        # 職業固有
        list   = KMS_DistributeParameter::CLASS_GAIN_PARAMS[@class_id]
        result = KMS_DistributeParameter.merge(result, list) if list != nil
  
        @@__distribute_gain_params[key] = result
      end
  
      return @@__distribute_gain_params[key]
    end
    #--------------------------------------------------------------------------
    # ○ パラメータ増加量を取得
    #     key : 振り分けキー
    #--------------------------------------------------------------------------
    def gain_parameter(key)
      return gain_parameter_list.find { |v| v.key == key }
    end
    #--------------------------------------------------------------------------
    # ○ 各種修正値を計算
    #--------------------------------------------------------------------------
    def calc_distribution_values
      @rp_cost = 0
      @distributed_param = {}
      KMS_DistributeParameter::PARAMS.each { |param|
        @distributed_param[param] = 0
      }
  
      gain_parameter_list.each { |gain|
        next if gain == nil
        cost = 0
        distributed_count(gain.key).times { |i|
          cost += Integer(gain.cost + gain.cost_rev * i)
          gain.params.each { |param, v|
            @distributed_param[param] += v.value + v.value_rev * i
          }
        }
        @rp_cost += [cost, 0].max
      }
  
      KMS_DistributeParameter::PARAMS.each { |param|
        @distributed_param[param] = @distributed_param[param]
      }
    end
    #--------------------------------------------------------------------------
    # ○ 各種修正値を修復
    #--------------------------------------------------------------------------
    def restore_distribution_values
      calc_distribution_values
      self.hp = self.hp
      self.mp = self.mp
    end
    #--------------------------------------------------------------------------
    # ○ 振り分けによる上昇値を取得
    #     param : パラメータの Symbol
    #--------------------------------------------------------------------------
    def distributed_param(param)
      return 0 if @distributed_param == nil
      return 0 if @distributed_param[param] == nil
      return @distributed_param[param]
    end
    PARAM_SYMBOL  = [:mhp, :mmp, :atk, :def, :mat, :mdf, :agi, :luk]
    XPARAM_SYMBOL = [:hit, :eva, :cri, :cev, :mev, :mrf, :cnt, :hrg, :mrg, :trg]
    SPARAM_SYMBOL = [:tgr, :grd, :rec, :pha, :mcr, :tcr, :pdr, :mdr, :fdr, :exr]
    #--------------------------------------------------------------------------
    # ● 通常能力値の基本値取得
    #--------------------------------------------------------------------------
    alias param_base_KMS_DistributeParameter param_base
    def param_base(param_id)
      n = param_base_KMS_DistributeParameter(param_id)
      if PARAM_SYMBOL[param_id] != nil
        n += distributed_param(PARAM_SYMBOL[param_id])
      end
  
      return Integer(n)
    end
    #--------------------------------------------------------------------------
    # ● Adjusts the HIT ex-param
    #--------------------------------------------------------------------------
    alias hit_KMS_DistributeParameter hit
    def hit
      n = hit_KMS_DistributeParameter + distributed_param(:hit)
      return n
    end
    #--------------------------------------------------------------------------
    # ● Adjusts the EVA ex-param
    #--------------------------------------------------------------------------
    alias eva_KMS_DistributeParameter eva
    def eva
      n = eva_KMS_DistributeParameter + distributed_param(:eva)
      return n
    end
    #--------------------------------------------------------------------------
    # ● Adjusts the phys-crit-evade ex-param
    #--------------------------------------------------------------------------
    alias cev_KMS_DistributeParameter cev
    def cev
      n = cev_KMS_DistributeParameter + distributed_param(:cev)
      return n
    end
    #--------------------------------------------------------------------------
    # ● Adjusts the magi-crit-evade ex-param
    #--------------------------------------------------------------------------
    alias mev_KMS_DP_J mev
    def mev
      n = mev_KMS_DP_J + distributed_param(:mev)
      return n
    end
    #--------------------------------------------------------------------------
    # ● クリティカル率の取得
    #--------------------------------------------------------------------------
    alias cri_KMS_DistributeParameter cri
    def cri
      n = cri_KMS_DistributeParameter + distributed_param(:cri)
      return n
    end
    #--------------------------------------------------------------------------
    # ● Adjusts the magi-reflect ex-param
    #--------------------------------------------------------------------------
    alias mrf_KMS_DP_J mrf
    def mrf
      n = mrf_KMS_DP_J + distributed_param(:mrf)
      return n
    end
    #--------------------------------------------------------------------------
    # ● Adjusts the counter-attack ex-param
    #--------------------------------------------------------------------------
    alias cnt_KMS_DP_J cnt
    def cnt
      n = cnt_KMS_DP_J + distributed_param(:cnt)
      return n
    end
    #--------------------------------------------------------------------------
    # ● Adjusts the hp-regen ex-param
    #--------------------------------------------------------------------------
    alias hrg_KMS_DP_J hrg
    def hrg
      n = hrg_KMS_DP_J + distributed_param(:hrg)
      return n
    end
    #--------------------------------------------------------------------------
    # ● Adjusts the mp-regen ex-param
    #--------------------------------------------------------------------------
    alias mrg_KMS_DP_J mrg
    def mrg
      n = mrg_KMS_DP_J + distributed_param(:mrg)
      return n
    end
    #--------------------------------------------------------------------------
    # ● Adjusts the tp-regen ex-param
    #--------------------------------------------------------------------------
    alias trg_KMS_DP_J trg
    def trg
      n = trg_KMS_DP_J + distributed_param(:trg)
      return n
    end
    
    
    #--------------------------------------------------------------------------
    # ● Adjusts the target-rate sp-param
    #--------------------------------------------------------------------------
    alias tgr_KMS_DistributeParameter tgr
    def tgr
      n = tgr_KMS_DistributeParameter + distributed_param(:tgr)
      return n
    end
    #--------------------------------------------------------------------------
    # ● Adjusts the guard-effect sp-param
    #--------------------------------------------------------------------------
    alias grd_KMS_DP_J grd
    def grd
      n = grd_KMS_DP_J + distributed_param(:grd)
      return n
    end
    #--------------------------------------------------------------------------
    # ● Adjusts the recovery-effect sp-param
    #--------------------------------------------------------------------------
    alias rec_KMS_DP_J rec
    def rec
      n = rec_KMS_DP_J + distributed_param(:rec)
      return n
    end
    #--------------------------------------------------------------------------
    # ● Adjusts the pharmacology sp-param
    #--------------------------------------------------------------------------
    alias pha_KMS_DP_J pha
    def pha
      n = pha_KMS_DP_J + distributed_param(:pha)
      return n
    end
    #--------------------------------------------------------------------------
    # ● Adjusts the magic-cost-modifier sp-param
    #--------------------------------------------------------------------------
    alias mcr_KMS_DP_J mcr
    def mcr
      n = mcr_KMS_DP_J + distributed_param(:mcr)
      return n
    end
    #--------------------------------------------------------------------------
    # ● Adjusts the TP-charge-rate sp-param
    #--------------------------------------------------------------------------
    alias tcr_KMS_DP_J tcr
    def tcr
      n = tcr_KMS_DP_J + distributed_param(:tcr)
      return n
    end
    #--------------------------------------------------------------------------
    # ● Adjusts the physical-damage-rate sp-param
    #--------------------------------------------------------------------------
    alias pdr_KMS_DP_J pdr
    def pdr
      n = pdr_KMS_DP_J + distributed_param(:pdr)
      return n
    end
    #--------------------------------------------------------------------------
    # ● Adjusts the magical-damage-rate sp-param
    #--------------------------------------------------------------------------
    alias mdr_KMS_DP_J mdr
    def mdr
      n = mdr_KMS_DP_J + distributed_param(:mdr)
      return n
    end
    #--------------------------------------------------------------------------
    # ● Adjusts the floor-damage-rate sp-param
    #--------------------------------------------------------------------------
    alias fdr_KMS_DP_J fdr
    def fdr
      n = fdr_KMS_DP_J + distributed_param(:fdr)
      return n
    end
    #--------------------------------------------------------------------------
    # ● Adjusts the experience-modifier-rate sp-param
    #--------------------------------------------------------------------------
    alias exr_KMS_DP_J exr
    def exr
      n = exr_KMS_DP_J + distributed_param(:exr)
      return n
    end
    
    
    #--------------------------------------------------------------------------
    # ○ MaxRP formula
    #--------------------------------------------------------------------------
    def mrp
      n = Integer(eval(KMS_DistributeParameter::MAXRP_EXP))
      return [n + mrp_plus, 0].max
    end
    #--------------------------------------------------------------------------
    # ○ MaxRP bonus adjustment
    #--------------------------------------------------------------------------
    def mrp_plus
      @mrp_plus = 0 if @mrp_plus == nil
      return @mrp_plus
    end
    #--------------------------------------------------------------------------
    # ○ RP rate
    #--------------------------------------------------------------------------
    def rp
      return [mrp - @rp_cost, 0].max
    end
    #--------------------------------------------------------------------------
    # ○ 振り分け回数の取得
    #     param : 振り分け先パラメータ (キー)
    #--------------------------------------------------------------------------
    def distributed_count(param)
      clear_distribution_values     if @distributed_count == nil
      @distributed_count[param] = 0 if @distributed_count[param] == nil
      return @distributed_count[param]
    end
    #--------------------------------------------------------------------------
    # ○ RP on-field gain
    #     value : a number that you want to gain
    #--------------------------------------------------------------------------
    def gain_rp(value)
      @mrp_plus = mrp_plus + value
    end
    #--------------------------------------------------------------------------
    # ○ 振り分け回数の増減
    #     param : 振り分け先パラメータ (キー)
    #     value : 増減量
    #--------------------------------------------------------------------------
    def gain_distributed_count(param, value = 1)
      n = distributed_count(param)
      @distributed_count[param] += value if n.is_a?(Integer)
    end
    #--------------------------------------------------------------------------
    # ○ RP 振り分けによる成長効果適用
    #     param   : 振り分け先パラメータ (キー)
    #     reverse : 逆加算のときは true
    #--------------------------------------------------------------------------
    def rp_growth_effect(param, reverse = false)
      gain = gain_parameter(param)
      return if gain == nil  # 無効なパラメータ
  
      if reverse
        return if distributed_count(param) == 0  # 逆加算不可
      else
        return unless can_distribute?(param)
      end
  
      gain_distributed_count(param, reverse ? -1 : 1)
      restore_distribution_values
    end
    #--------------------------------------------------------------------------
    # ○ パラメータ振り分け可否判定
    #     param : 振り分け先パラメータ (キー)
    #--------------------------------------------------------------------------
    def can_distribute?(param)
      gain = gain_parameter(param)
      return false if gain == nil                        # 無効なパラメータ
      return false if self.rp < distribute_cost(param)   # RP 不足
      if gain.limit > 0
        return false if gain.limit <= distributed_count(param)  # 回数上限
      end
  
      return true
    end
    #--------------------------------------------------------------------------
    # ○ パラメータ振り分けコスト計算
    #     param : 振り分け先パラメータ (キー)
    #--------------------------------------------------------------------------
    def distribute_cost(param)
      gain = gain_parameter(param)
      return 0 if gain == nil  # 無効なパラメータ
  
      n = gain.cost
      count = distributed_count(param)
      count = [count, gain.limit - 1].min if gain.limit > 0
      n += gain.cost_rev * count
      return [Integer(n), 0].max
    end
    #--------------------------------------------------------------------------
    # ○ パラメータ振り分け後の増加量計算
    #     param : 振り分け先パラメータ (キー)
    #     amt   : 振り分け数
    #--------------------------------------------------------------------------
    def distribute_gain(param, amt = 1)
      gain = gain_parameter(param)
  
      # 無効なパラメータ
      return 0 if gain == nil
  
      result = {}
      KMS_DistributeParameter::PARAMS.each { |par|
        result[par] = distributed_param(par)
      }
  
      # 振り分け不可
      if amt > 0
        return result if gain.limit > 0 && gain.limit == distributed_count(param)
      else
        return result if distributed_count(param) + amt < 0
      end
  
      last_hp = self.hp
      last_mp = self.mp
      last_count = distributed_count(param)
      rp_growth_effect(param)
      KMS_DistributeParameter::PARAMS.each { |par|
        result[par] = distributed_param(par) if gain.params.include?(par)
      }
      rp_growth_effect(param, true) if last_count < distributed_count(param)
      self.hp = last_hp
      self.mp = last_mp
  
      return result
    end
  end
  
  #★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★
  
  #==============================================================================
  # ■ Window_Base
  #==============================================================================
  
  class Window_Base < Window
    #--------------------------------------------------------------------------
    # ○ RP の文字色を取得
    #     actor : アクター
    #--------------------------------------------------------------------------
    def rp_color(actor)
      return (actor.rp == 0 ? knockout_color : normal_color)
    end
    #--------------------------------------------------------------------------
    # ○ 振り分けゲージの色 1 の取得
    #--------------------------------------------------------------------------
    def distribute_gauge_color1
      color = KMS_DistributeParameter::GAUGE_START_COLOR
      return (color.is_a?(Integer) ? text_color(color) : color)
    end
    #--------------------------------------------------------------------------
    # ○ 振り分けゲージの色 2 の取得
    #--------------------------------------------------------------------------
    def distribute_gauge_color2
      color = KMS_DistributeParameter::GAUGE_END_COLOR
      return (color.is_a?(Integer) ? text_color(color) : color)
    end
    #--------------------------------------------------------------------------
    # ○ RP の描画
    #     actor : アクター
    #     x     : 描画先 X 座標
    #     y     : 描画先 Y 座標
    #     width : 幅
    #--------------------------------------------------------------------------
    def draw_actor_rp(actor, x, y, width = 124)
      change_color(system_color)
      draw_text(x, y, 30, line_height, Vocab::rp_a)
      draw_current_and_max_values(x, y, width, actor.rp, actor.mrp,
        rp_color(actor), normal_color)
      change_color(normal_color)
    end
    #--------------------------------------------------------------------------
    # ○ RP の描画
    #     actor : アクター
    #     x     : 描画先 X 座標
    #     y     : 描画先 Y 座標
    #     width : 幅
    #--------------------------------------------------------------------------
    def draw_l_r_switch(x, y, w = 300)
      change_color(system_color)
      text = "Use L or R to switch."
      draw_text(x, y, w, line_height, text)
      change_color(normal_color)
    end
    #--------------------------------------------------------------------------
    # ○ 振り分けゲージの描画
    #     actor : アクター
    #     param : パラメータ
    #     x     : 描画先 X 座標
    #     y     : 描画先 Y 座標
    #     width : 幅
    #--------------------------------------------------------------------------
    def draw_actor_distribute_gauge(actor, param, x, y, width = 124)
      gain = actor.gain_parameter(param)
      return if gain == nil || gain.limit <= 0
  
      rate = actor.distributed_count(param) * 1.0 / gain.limit
      if $kms_imported["GenericGauge"] &&
          KMS_DistributeParameter::ENABLE_GENERIC_GAUGE
        # 汎用ゲージ
        draw_generic_gauge(KMS_DistributeParameter::GAUGE_IMAGE,
          x, y, width, rate,
          KMS_DistributeParameter::GAUGE_OFFSET,
          KMS_DistributeParameter::GAUGE_LENGTH,
          KMS_DistributeParameter::GAUGE_SLOPE)
      else
        # デフォルトゲージ
        gc1  = distribute_gauge_color1
        gc2  = distribute_gauge_color2
        draw_gauge(x, y, width, rate, gc1, gc2)
      end
    end
  end
  
  #★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★
  
  #==============================================================================
  # ■ Window_MenuCommand
  #==============================================================================
  
  class Window_MenuCommand < Window_Command
    if KMS_DistributeParameter::USE_MENU_DISTRIBUTE_PARAMETER_COMMAND &&
        !$kms_imported["CustomMenuCommand"]
      #--------------------------------------------------------------------------
      # ● コマンドリストの作成
      #--------------------------------------------------------------------------
      alias make_command_list_KMS_DistributeParameter make_command_list
      def make_command_list
        make_command_list_KMS_DistributeParameter
        add_distribute_parameter_command
      end
    end
    #--------------------------------------------------------------------------
    # ○ 振り分けコマンドをリストに追加
    #--------------------------------------------------------------------------
    def add_distribute_parameter_command
      add_command(Vocab::distribute_parameter,
        :distribute_parameter,
        distribute_parameter_enabled)
    end
    #--------------------------------------------------------------------------
    # ○ パラメータ振り分けの有効状態を取得
    #--------------------------------------------------------------------------
    def distribute_parameter_enabled
      return true
    end
  end
  
  #★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★
  
  #==============================================================================
  # □ Window_DistributeParameterActor
  #------------------------------------------------------------------------------
  #   振り分け画面で、アクターの情報を表示するウィンドウです。
  #==============================================================================
  
  class Window_DistributeParameterActor < Window_Base
    #--------------------------------------------------------------------------
    # ○ 公開インスタンス変数
    #--------------------------------------------------------------------------
    attr_accessor :actor
    #--------------------------------------------------------------------------
    # ● オブジェクト初期化
    #     x     : ウィンドウの X 座標
    #     y     : ウィンドウの Y 座標
    #     actor : アクター
    #--------------------------------------------------------------------------
    def initialize(x, y, actor)
      super(x, y, Graphics.width, line_height + 32)
      @actor = actor
      refresh
    end
    #--------------------------------------------------------------------------
    # ● リフレッシュ
    #--------------------------------------------------------------------------
    def refresh
      contents.clear
      draw_actor_name(@actor, 4, 0)
      draw_actor_level(@actor, 140, 0)
      draw_actor_rp(@actor, 240, 0)
      draw_l_r_switch(380, 0)
    end
  end
  
  #★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★
  
  #==============================================================================
  # □ Window_DistributeParameterList
  #------------------------------------------------------------------------------
  #   振り分け画面で、成長させるパラメータを選択するウィンドウです。
  #==============================================================================
  
  class Window_DistributeParameterList < Window_Selectable
    #--------------------------------------------------------------------------
    # ○ 公開インスタンス変数
    #--------------------------------------------------------------------------
    attr_accessor :actor
    #--------------------------------------------------------------------------
    # ● オブジェクト初期化
    #     actor : アクター
    #--------------------------------------------------------------------------
    def initialize(actor)
      off_h = line_height + 32
      super(0, off_h, 286, Graphics.height - off_h)
      @actor = actor
      refresh
      self.index = 0
    end
    #--------------------------------------------------------------------------
    # ○ 選択中のパラメータの Symbol を取得
    #--------------------------------------------------------------------------
    def parameter_key
      return @data[self.index]
    end
    #--------------------------------------------------------------------------
    # ● 項目数の取得
    #--------------------------------------------------------------------------
    def item_max
      return @data == nil ? 0 : @data.size
    end
    #--------------------------------------------------------------------------
    # ● 1 ページに表示できる行数の取得
    #--------------------------------------------------------------------------
    def page_row_max
      return super - 1
    end
    #--------------------------------------------------------------------------
    # ● 項目を描画する矩形の取得
    #     index : 項目番号
    #--------------------------------------------------------------------------
    def item_rect(index)
      rect = super(index)
      rect.y += line_height
      return rect
    end
    #--------------------------------------------------------------------------
    # ● カーソルを 1 ページ後ろに移動
    #--------------------------------------------------------------------------
    def cursor_pagedown
      return if Input.repeat?(Input::R)
      super
    end
    #--------------------------------------------------------------------------
    # ● カーソルを 1 ページ前に移動
    #--------------------------------------------------------------------------
    def cursor_pageup
      return if Input.repeat?(Input::L)
      super
    end
    #--------------------------------------------------------------------------
    # ● リフレッシュ
    #--------------------------------------------------------------------------
    def refresh
      @gain_list = @actor.gain_parameter_list
      @data = []
      @gain_list.each { |gain| @data << gain.key }
      @item_max = @data.size + 1
      create_contents
      @item_max -= 1
      draw_caption
      @item_max.times { |i| draw_item(i, @actor.can_distribute?(@data[i])) }
    end
    #--------------------------------------------------------------------------
    # ○ 見出しの描画
    #--------------------------------------------------------------------------
    def draw_caption
      change_color(system_color)
      draw_text(  4, 0, 96, line_height, "Parameter")
      draw_text(120, 0, 40, line_height, Vocab.rp, 2)
      draw_text(170, 0, 80, line_height, "Rank", 2)
      change_color(normal_color)
    end
    #--------------------------------------------------------------------------
    # ○ 項目の描画
    #     index   : 項目番号
    #     enabled : 有効フラグ
    #--------------------------------------------------------------------------
    def draw_item(index, enabled = true)
      rect = item_rect(index)
      contents.clear_rect(rect)
      item = @data[index]
      if item != nil
        draw_parameter(rect.x, rect.y, @data[index], enabled)
      end
    end
    #--------------------------------------------------------------------------
    # ○ 能力値の描画
    #     x       : 描画先 X 座標
    #     y       : 描画先 Y 座標
    #     param   : 振り分け先
    #     enabled : 有効フラグ
    #--------------------------------------------------------------------------
    def draw_parameter(x, y, param, enabled)
      gain = @gain_list.find { |v| v.key == param }
      return if gain == nil
  
      change_color(normal_color)
      contents.font.color.alpha = enabled ? 255 : 128
      draw_text(x + 4, y, 160, line_height, gain.name)
  
      # コスト描画
      value = @actor.distribute_cost(param)
      draw_text(x + 120, y, 40, line_height, value, 2)
  
      # 振り分け回数描画
      if gain.limit > 0
        value = sprintf("%3d/%3d", @actor.distributed_count(param), gain.limit)
      else
        value = sprintf("%3d%s", @actor.distributed_count(param),
          KMS_DistributeParameter::HIDE_MAX_COUNT_INFINITE ? "" : "/---")
      end
      draw_actor_distribute_gauge(@actor, param, x + 170, y, 80)
      draw_text(x + 170, y, 80, line_height, value, 2)
  
      change_color(normal_color)
    end
    #--------------------------------------------------------------------------
    # ● 決定やキャンセルなどのハンドリング処理
    #--------------------------------------------------------------------------
    def process_handling
      super
      call_handler(:increase) if handle?(:increase) && Input.repeat?(:RIGHT)
      call_handler(:decrease) if handle?(:decrease) && Input.repeat?(:LEFT)
      call_handler(:up)       if handle?(:up)       && Input.repeat?(:UP)
      call_handler(:down)     if handle?(:down)     && Input.repeat?(:DOWN)
    end
  end
  
  #★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★
  
  #==============================================================================
  # □ Window_DistributeParameterStatus
  #------------------------------------------------------------------------------
  #   振り分け画面で、アクターのステータスを表示するウィンドウです。
  #==============================================================================
  
  class Window_DistributeParameterStatus < Window_Base
    #--------------------------------------------------------------------------
    # ○ 公開インスタンス変数
    #--------------------------------------------------------------------------
    attr_accessor :actor
    #--------------------------------------------------------------------------
    # ● オブジェクト初期化
    #     actor : アクター
    #--------------------------------------------------------------------------
    def initialize(actor)
      dx = 286
      off_h = line_height + 32
      super(dx, off_h, Graphics.width - dx, Graphics.height - off_h)
      @actor = actor
      refresh(actor.gain_parameter_list[0].key)
    end
    #--------------------------------------------------------------------------
    # ● リフレッシュ
    #--------------------------------------------------------------------------
    def refresh(param = nil)
      @distribute_gain = nil
      if param != nil
        @distribute_gain = @actor.distribute_gain(param)
      end
  
      contents.clear
  #~     change_color(system_color)
  #~     draw_text(0, 0, width - 32, line_height, "Parameter Changes", 1)
  #~     change_color(normal_color)
  
      dy = line_height
  #~     dy = 0
      KMS_DistributeParameter::PARAMS.each { |param|
        draw_parameter(0, dy-24, param)
        dy += line_height - 8
      }
    end
    #--------------------------------------------------------------------------
    # ○ 能力値の描画
    #     x    : 描画先 X 座標
    #     y    : 描画先 Y 座標
    #     type : 能力値の種類
    #--------------------------------------------------------------------------
    def draw_parameter(x, y, type)
      is_float = false
  
      case type
      when :mhp
        name  = Vocab.hp
        value = @actor.mhp
      when :mmp
        name  = Vocab.mp
        value = @actor.mmp
      when :atk
        name  = Vocab.param(2)
        value = @actor.atk
      when :def
        name  = Vocab.param(3)
        value = @actor.def
      when :mat
        name  = Vocab.param(4)
        value = @actor.mat
      when :mdf
        name  = Vocab.param(5)
        value = @actor.mdf
      when :agi
        name  = Vocab.param(6)
        value = @actor.agi
      when :luk
        name  = Vocab.param(7)
        value = @actor.luk
      when :hit
        name  = Vocab.hit
        value = @actor.hit
        is_float = true
      when :eva
        name  = Vocab.eva
        value = @actor.eva
        is_float = true
      when :cri
        name  = Vocab.cri
        value = @actor.cri
        is_float = true
      when :cev
        name  = Vocab.cev
        value = @actor.cev
        is_float = true
      when :mev
        name  = Vocab.mev
        value = @actor.mev
        is_float = true
      when :mrf
        name  = Vocab.mrf
        value = @actor.mrf
        is_float = true
      when :cnt
        name  = Vocab.cnt
        value = @actor.cnt
        is_float = true
      when :hrg
        name  = Vocab.hrg
        value = @actor.hrg
        is_float = true
      when :mrg
        name  = Vocab.mrg
        value = @actor.mrg
        is_float = true
      when :trg
        name  = Vocab.trg
        value = @actor.trg
        is_float = true
      when :skill_speed
        name  = Vocab.skill_speed
        value = @actor.distributed_param(type)
      when :item_speed
        name  = Vocab.item_speed
        value = @actor.distributed_param(type)
      when :tgr
        name  = Vocab.tgr
        value = @actor.tgr
        is_float = true
      when :grd
        name  = Vocab.grd
        value = @actor.grd
        is_float = true
        guard = true
      when :rec
        name  = Vocab.rec
        value = @actor.rec
        is_float = true
      when :pha
        name  = Vocab.pha
        value = @actor.pha
        is_float = true
      when :mcr
        name  = Vocab.mcr
        value = @actor.mcr
        is_float = true
      when :tcr
        name  = Vocab.tcr
        value = @actor.tcr
        is_float = true
      when :pdr
        name  = Vocab.pdr
        value = @actor.pdr
        is_float = true
      when :mdr
        name  = Vocab.mdr
        value = @actor.mdr
        is_float = true
      when :fdr
        name  = Vocab.fdr
        value = @actor.fdr
        is_float = true
      when :exr
        name  = Vocab.exr
        value = @actor.exr
        is_float = true
      else
        return
      end
  
      # Parameter Name
      change_color(system_color)
      draw_text(x + 4, y, 160, line_height, name)
      change_color(normal_color)
      draw_text(x + 106, y, 48, line_height, convert_value(value, is_float), 2)
  
      return if @distribute_gain == nil
  
      # Parameter Change
      draw_text(x + 154, y, 16, line_height, "→", 1)
  
      curr = @actor.distributed_param(type)
      gain = @distribute_gain[type]
      change_color(gain > curr ? text_color(3) : gain < curr ?
          text_color(2) : normal_color)
      new_value = value + (gain - curr)
      draw_text(x + 174, y, 48, line_height, convert_value(new_value, is_float), 2)
      change_color(normal_color)
    end
    
    def convert_value(value, is_float)
      if is_float #asdfasdf
  #~       return sprintf("%.2f", value * 100)
        return (value*100).to_i.to_s
      else
        return value.to_i.to_s
      end
    end
  end
  
  #★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★
  
  #==============================================================================
  # □ Window_DistributeParameterConfirm
  #------------------------------------------------------------------------------
  #   振り分け画面で、振り分けの確定/中止を選択するウィンドウです。
  #==============================================================================
  
  class Window_DistributeParameterConfirm < Window_Command
    #--------------------------------------------------------------------------
    # ● ウィンドウ幅の取得
    #--------------------------------------------------------------------------
    def window_width
      return KMS_DistributeParameter::CONFIRM_WIDTH
    end
    #--------------------------------------------------------------------------
    # ● コマンドリストの作成
    #--------------------------------------------------------------------------
    def make_command_list
      super
      add_command(KMS_DistributeParameter::CONFIRM_COMMANDS[0], :decide)
      add_command(KMS_DistributeParameter::CONFIRM_COMMANDS[1], :stop)
      add_command(KMS_DistributeParameter::CONFIRM_COMMANDS[2], :cancel)
    end
    #--------------------------------------------------------------------------
    # ● ヘルプテキスト更新
    #--------------------------------------------------------------------------
    def update_help
      text = index >= 0 ? KMS_DistributeParameter::CONFIRM_COMMAND_HELP[index] : nil
      @help_window.set_text(text)
    end
  end
  
  #★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★
  
  #==============================================================================
  # ■ Scene_Map
  #==============================================================================
  
  class Scene_Map < Scene_Base
    #--------------------------------------------------------------------------
    # ● シーン遷移に関連する更新
    #--------------------------------------------------------------------------
    alias update_scene_KMS_DistributeParameter update_scene
    def update_scene
      update_scene_KMS_DistributeParameter
  
      update_call_distribute_parameter unless scene_changing?
    end
    #--------------------------------------------------------------------------
    # ○ パラメータ振り分け画面呼び出し判定
    #--------------------------------------------------------------------------
    def update_call_distribute_parameter
      if $game_temp.call_distribute_parameter && !$game_player.moving?
        $game_temp.call_distribute_parameter = false
        call_distribute_parameter
      end
    end
    #--------------------------------------------------------------------------
    # ○ パラメータ振り分け画面への切り替え
    #--------------------------------------------------------------------------
    def call_distribute_parameter
      SceneManager.call(Scene_DistributeParameter)
    end
  end
  
  #★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★
  
  #==============================================================================
  # ■ Scene_Menu
  #==============================================================================
  
  class Scene_Menu < Scene_MenuBase
    #--------------------------------------------------------------------------
    # ● コマンドウィンドウの作成
    #--------------------------------------------------------------------------
    alias create_command_window_KMS_DistributeParameter create_command_window
    def create_command_window
      create_command_window_KMS_DistributeParameter
  
      @command_window.set_handler(:distribute_parameter, method(:command_personal))
    end
    #--------------------------------------------------------------------------
    # ○ コマンド [パラメータ振り分け]
    #--------------------------------------------------------------------------
    def command_distribute_parameter
      SceneManager.call(Scene_DistributeParameter)
    end
    #--------------------------------------------------------------------------
    # ● 個人コマンド［決定］
    #--------------------------------------------------------------------------
    alias on_personal_ok_KMS_DistributeParameter on_personal_ok
    def on_personal_ok
      on_personal_ok_KMS_DistributeParameter
  
      if @command_window.current_symbol == :distribute_parameter
        command_distribute_parameter
      end
    end
  end
  
  #★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★☆★
  
  #==============================================================================
  # □ Scene_DistributeParameter
  #------------------------------------------------------------------------------
  #   パラメータ振り分け画面の処理を行うクラスです。
  #==============================================================================
  
  class Scene_DistributeParameter < Scene_MenuBase
    #--------------------------------------------------------------------------
    # ● 開始処理
    #--------------------------------------------------------------------------
    def start
      super
      @prev_actor = @actor
      @prev_info  = @actor.distribution_info
      create_help_window
      create_actor_window
      create_parameter_window
      create_status_window
      create_confirm_window
    end
    #--------------------------------------------------------------------------
    # ○ アクターウィンドウ作成
    #--------------------------------------------------------------------------
    def create_actor_window
      @actor_window = Window_DistributeParameterActor.new(0, 0, @actor)
      @actor_window.viewport = @viewport
    end
    #--------------------------------------------------------------------------
    # ○ パラメータリストウィンドウ作成
    #--------------------------------------------------------------------------
    def create_parameter_window
      @parameter_window = Window_DistributeParameterList.new(@actor)
      @parameter_window.viewport = @viewport
      @parameter_window.activate
      @parameter_window.set_handler(:ok,       method(:on_parameter_ok))
      @parameter_window.set_handler(:cancel,   method(:on_parameter_cancel))
      @parameter_window.set_handler(:increase, method(:on_parameter_increase))
      @parameter_window.set_handler(:decrease, method(:on_parameter_decrease))
      @parameter_window.set_handler(:down,     method(:update_status))
      @parameter_window.set_handler(:up,       method(:update_status))
      @parameter_window.set_handler(:pagedown, method(:next_actor))
      @parameter_window.set_handler(:pageup,   method(:prev_actor))
    end
    #--------------------------------------------------------------------------
    # ○ 振り分けステータスウィンドウ作成
    #--------------------------------------------------------------------------
    def create_status_window
      @status_window = Window_DistributeParameterStatus.new(@actor)
      @status_window.viewport = @viewport
  
      @help_window.z = @status_window.z + 100
      @help_window.openness = 0
    end
    #--------------------------------------------------------------------------
    # ○ 確認ウィンドウ作成
    #--------------------------------------------------------------------------
    def create_confirm_window
      @confirm_window = Window_DistributeParameterConfirm.new(0, 0)
      @confirm_window.x = (Graphics.width  - @confirm_window.width)  / 2
      @confirm_window.y = (Graphics.height - @confirm_window.height) / 2
      @confirm_window.z = @help_window.z
      @confirm_window.viewport    = @viewport
      @confirm_window.help_window = @help_window
      @confirm_window.openness    = 0
      @confirm_window.deactivate
      @confirm_window.set_handler(:decide, method(:on_confirm_decide))
      @confirm_window.set_handler(:stop,   method(:on_confirm_stop))
      @confirm_window.set_handler(:cancel, method(:on_confirm_cancel))
    end
    #--------------------------------------------------------------------------
    # ○ ウィンドウ再描画
    #--------------------------------------------------------------------------
    def refresh_window
      @actor_window.refresh
      @parameter_window.refresh
      @status_window.refresh(@parameter_window.parameter_key)
      Graphics.frame_reset
    end
    #--------------------------------------------------------------------------
    # ○ パラメータ選択 [決定]
    #--------------------------------------------------------------------------
    def on_parameter_ok
      command_confirm
    end
    #--------------------------------------------------------------------------
    # ○ パラメータ選択 [キャンセル]
    #--------------------------------------------------------------------------
    def on_parameter_cancel
      command_confirm
    end
    #--------------------------------------------------------------------------
    # ○ パラメータ選択 [加算]
    #--------------------------------------------------------------------------
    def on_parameter_increase
      param = @parameter_window.parameter_key
      unless @actor.can_distribute?(param)
        Sound.play_buzzer
        return
      end
      Sound.play_cursor
      @actor.rp_growth_effect(param)
      refresh_window
    end
    #--------------------------------------------------------------------------
    # ○ パラメータ選択 [減算]
    #--------------------------------------------------------------------------
    def on_parameter_decrease
      param = @parameter_window.parameter_key
      unless reversible?(param)
        Sound.play_buzzer
        return
      end
      Sound.play_cursor
      @actor.rp_growth_effect(param, true)
      refresh_window
    end
    #--------------------------------------------------------------------------
    # ○ ステータス更新
    #--------------------------------------------------------------------------
    def update_status
      @status_window.refresh(@parameter_window.parameter_key)
    end
    #--------------------------------------------------------------------------
    # ○ 減算可否判定
    #     param : 対象パラメータ
    #--------------------------------------------------------------------------
    def reversible?(param)
      return false if @actor.distributed_count(param) == 0
      return true  if KMS_DistributeParameter::ENABLE_REVERSE_DISTRIBUTE
  
      # 前回より減らなければ OK
      base = @prev_info.count[param]
      return ( base < @actor.distributed_count(param) )
    end
    #--------------------------------------------------------------------------
    # ○ パラメータウィンドウに切り替え
    #--------------------------------------------------------------------------
    def command_parameter
      @confirm_window.deactivate
      @confirm_window.close
      @help_window.close
      @parameter_window.activate
    end
    #--------------------------------------------------------------------------
    # ○ 確認ウィンドウに切り替え
    #--------------------------------------------------------------------------
    def command_confirm
      @status_window.refresh
      @confirm_window.index  = 0
      @confirm_window.activate
      @confirm_window.open
      @help_window.open
      @parameter_window.deactivate
    end
    #--------------------------------------------------------------------------
    # ○ 確認 [確定]
    #--------------------------------------------------------------------------
    def on_confirm_decide
      return_scene
    end
    #--------------------------------------------------------------------------
    # ○ 確認 [中止]
    #--------------------------------------------------------------------------
    def on_confirm_stop
      @actor.set_distribution_info(@prev_info)
      return_scene
    end
    #--------------------------------------------------------------------------
    # ○ 確認 [キャンセル]
    #--------------------------------------------------------------------------
    def on_confirm_cancel
      command_parameter
    end
    #--------------------------------------------------------------------------
    # ● アクターの切り替え
    #--------------------------------------------------------------------------
    def on_actor_change
      @prev_actor.set_distribution_info(@prev_info)
      @prev_info  = @actor.distribution_info
      @prev_actor = @actor
  
      @actor_window.actor     = @actor
      @parameter_window.actor = @actor
      @status_window.actor    = @actor
      @parameter_window.activate
      refresh_window
    end
  end
  