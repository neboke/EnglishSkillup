import json
import random
import os
import re

# --- Verbs Data ---
verbs_raw = """
cut,cut,cut,cutting,切る
hit,hit,hit,hitting,打つ
hurt,hurt,hurt,hurting,痛む
let,let,let,letting,〜しよう（let's）
put,put,put,putting,置く
read,read,read,reading,読む
set,set,set,setting,置く、すえる
shed,shed,shed,shedding,（涙などを）流す
shut,shut,shut,shutting,閉める
become,came,come,becoming,〜になる
come,came,come,coming,来る
run,ran,run,running,走る
bring,brought,brought,bringing,持ってくる
build,built,built,building,建てる
buy,bought,bought,buying,買う
catch,caught,caught,catching,つかまえる
feel,felt,felt,feeling,感じる
fight,fought,fought,fighting,戦う
find,found,found,finding,見つける
forget,forgot,forgot/forgotten,forgetting,忘れる
get,got,got/gotten,getting,得る
hang,hung,hung,hanging,かける
have,had,had,having,持っている
hear,heard,heard,hearing,聞く
hold,held,held,holding,催す、抱く
keep,kept,kept,keeping,もち続ける
lead,led,led,leading,導く
learn,learned/learnt,learned/learnt,learning,学ぶ
leave,left,left,leaving,出発する
lend,lent,lent,lending,貸す
lose,lost,lost,losing,失う
make,made,made,making,作る
mean,meant,meant,meaning,意味する
meet,met,met,meeting,会う
say,said,said,saying,言う
sell,sold,sold,selling,売る
send,sent,sent,sending,送る
sit,sat,sat,sitting,座る
sleep,slept,slept,sleeping,眠る
smell,smelled/smelt,smelled/smelt,smelling,においをかぐ
spend,spent,spent,spending,過ごす
stand,stood,stood,standing,立っている
strike,struck,struck,striking,打つ
swing,swung,swung,swinging,振る
teach,taught,taught,teaching,教える
tell,told,told,telling,話す、教える
think,thought,thought,thinking,思う、考える
understand,understood,understood,understanding,理解する
win,won,won,winning,勝つ
be,was/were,been,being,〜である、〜にいる
begin,began,begun,beginning,始める
blow,blew,blown,blowing,吹く
break,broke,broken,breaking,折る
choose,chose,chosen,choosing,選ぶ
do,did,done,doing,する
draw,drew,drawn,drawing,描く
drink,drank,drunk,drinking,飲む
drive,drove,driven,driving,運転する
eat,ate,eaten,eating,食べる
fall,fell,fallen,falling,落ちる
fly,flew,flown,flying,飛ぶ
give,gave,given,giving,与える
go,went,gone,going,行く
grow,grew,grown,growing,成長する
hide,hid,hidden,hiding,かくす
know,knew,known,knowing,知っている
mistake,mistook,mistaken,mistaking,まちがえる
ride,rode,ridden,riding,乗る
ring,rang,rung,ringing,鳴る
rise,rose,risen,rising,のぼる
see,saw,seen,seeing,見る、会う
shake,shook,shaken,shaking,ふる
show,showed,shown,showing,見せる
sing,sang,sung,singing,歌う
speak,spoke,spoken,speaking,話す
steal,stole,stolen,stealing,盗む
swim,swam,swum,swimming,泳ぐ
take,took,taken,taking,持っていく
throw,threw,thrown,throwing,投げる
wake,woke/waked,woken/waked,waking,目が覚める
wear,wore,worn,wearing,着る
write,wrote,written,writing,書く
"""

verbs_clean = []
lines = verbs_raw.strip().split('\n')
for line in lines:
    parts = line.split(',')
    if len(parts) >= 5:
        base = parts[0].strip()
        past = parts[1].strip()
        pp = parts[2].strip()
        meaning = parts[4].strip()
        
        # Manual Fixes
        if base == 'become': past = 'became'; pp = 'become'
        if base == 'come': past = 'came'; pp = 'come'
        if base == 'run': past = 'ran'; pp = 'run'
        
        verbs_clean.append({
            "id": f"verb_finals_{base}",
            "type": "verb",
            "base": base,
            "past": past,
            "pastParticiple": pp,
            "meaning": meaning,
            "category": "finals_range",
            "difficulty": "medium"
        })

# --- Sentences Data ---
# Use *text* to mark bold sections.
sentences_marked = """
I *was* busy yesterday.|私はいそがしかったです。
They *were not* [weren't] here last week.|彼らは先週、ここにいませんでした。
*Were* you at home last night? Yes, I *was*. / No, I *was not* [wasn't].|あなたは昨夜、家にいましたか。はい、いました。/いいえ、いませんでした。
I *studied* English yesterday.|私はきのう、英語を勉強しました。
I *saw* him yesterday.|私はきのう、彼に会いました。
He *did not*[didn't] play soccer.|彼はサッカーをしませんでした。
I *was playing* tennis then.|私はそのとき、テニスをしていました。
We *were not*[weren't] *running*.|私たちは走っていませんでした。
*Was* he *studying* English? Yes, he *was*. / No, he *wasn't*.|彼は英語を勉強していましたか。はい、していました。/いいえ、していませんでした。
I *will write* to him.|私は彼に手紙を書くつもりです。
*Will* you be free this afternoon? Yes, I *will*. / No, I *will not* [won't].|今日の午後は暇ですか。はい、暇です。/いいえ、暇ではありません。
I *am going to* play soccer.|私はサッカーをするつもりです。
*Are* you *going to* visit Kyoto? Yes, I *am*. / No, I*'m not*.|あなたは京都を訪れるつもりですか。はい、訪れます。/いいえ、訪れません。
*There is* a book on the desk.|机の上に本があります。
*There were not*[weren't] any cats on the chair.|いすの上にねこはいませんでした。
*Are there* any apples in the box? Yes, *there are*. / No, *there aren't*.|箱の中にリンゴがありますか。はい、あります。/いいえ、ありません。
*Why* do you *want* a camera?|あなたはなぜカメラがほしいのですか。
*How* do you *come* to school?|あなたはどうやって通学していますか。
I *can speak* English.|私は英語が話せます。
He *could not sleep* well last night.|彼は昨夜、よく眠れませんでした。
Jane *is able to* play the piano.|ジェーンはピアノをひくことができます。
He *is not able to* drive a car.|彼は車を運転することができません。
I *must wash* the dishes.|私は皿を洗わなければなりません。
You *must not sleep* in the library.|図書館で寝てはいけません。
*Must* I *do* the job?|私はその仕事をしなければなりませんか。
We *have to go* there.|私たちはそこへ行かなければなりません。
You *may come* here.|あなたはここに来てもいいですよ。
You *may not eat* this cake.|あなたはこのケーキを食べてはいけません。
*May* I *use* this pen? Yes, you *may*. / No, you *may not*.|このペンを使ってもいいですか。はい、いいですよ。/いいえ、いけません。
She *may be* busy.|彼女は忙しいかもしれません。
He *must be* sick.|彼は病気にちがいありません。
*Will* you *open* the door?|ドアを開けてくれませんか。
*Shall* I *help* you?|お手伝いしましょうか。
*Would* you *like* some cookies?|クッキーはいかがですか。
*Could* you *help* me?|私を手伝っていただけませんか。
You are a student, *aren't you*?|あなたは学生ですね。
He likes apples, *doesn't he*?|彼はリンゴが好きなんですね。
Jane can't swim, *can she*?|ジェーンは泳げないのですね。
Help me, *will you*?|手伝ってくれませんか。
Let's have a party, *shall we*?|パーティーをしましょうね。
*What* a beautiful *flower* this is!|これはなんと美しい花でしょう。
I like *playing* the violin.|私はバイオリンをひくことが好きです。
*Speaking* English is not easy.|英語を話すことは簡単ではありません。
My hobby is *watching* soccer games.|私の趣味はサッカーの試合を見ることです。
She *likes to skate*.|彼女はスケートをすることが好きです。
*To study* English is important.|英語を勉強することは大切です。
My hope *is to be* a scientist.|私の望みは科学者になることです。
He studied hard *to become* a doctor.|彼は医者になるために一生けん命勉強しました。
I am *happy to see* you.|私はあなたにお会いできて嬉しいです。
I have a lot of work *to do* today.|私は今日、するべき仕事がたくさんあります。
He had no time *to play*.|彼には遊ぶ（ための）時間はありませんでした。
*It is* easy *to play* soccer.|サッカーをすることは簡単です。
*It is* difficult *for* me *to play* the piano.|私がピアノをひくのは難しいです。
He knows *how to get* to the station.|彼は駅への行きかたを知っています。
I *asked* her *to come* to my house.|私は彼女に私の家に来るように頼みました。
She *walked* slowly.|彼女はゆっくり歩きました。
He *looks* happy.|彼は幸せそうに見えます。
The boy *had* a ball.|その少年はボールを持っていました。
My mother *gave* me this book.|私の母が私にこの本をくれました。
My mother *gave* this book *to* me.|私の母がこの本を私にくれました。
We *call* the cat Hanako.|私たちはそのねこを花子と呼びます。
My sister *and* I *went* to Kyoto.|姉と私は京都に行きました。
*When* I visited him, he was out.|私が彼を訪ねたとき、彼は出かけていました。
I *think that* Mary is very kind.|私はメアリーはとても親切だと思います。
You are *older than* my brother.|あなたは私の兄[弟]よりも年上です。
This book is *more difficult than* that one.|この本はあれよりも難しいです。
*Which is larger*, Japan or England?|日本とイギリスではどちらが広いですか。
*Which* do you like *better*, dogs or cats?|あなたはイヌとねこではどちらが好きですか。
"""

sentences_clean = []
lines = sentences_marked.strip().split('\n')

for i, line in enumerate(lines):
    if '|' not in line: continue
    
    en_raw, jp = line.split('|')
    en_raw = en_raw.strip()
    jp = jp.strip()
    
    # Extract bold parts (*...*)
    parts = []
    blanks = []
    last_end = 0
    
    # Placeholder insertion
    processed_template = ""
    # We iterate through the string and find matches
    matches = list(re.finditer(r'\*(.*?)\*', en_raw))
    
    if not matches:
        sentences_clean.append({
             "id": f"choice_finals_{i+1:03d}",
             "type": "choice",
             "prompt": jp,
             "choices": [en_raw, "Error in data generation"],
             "answer": en_raw,
             "category": "finals_range",
             "difficulty": "medium"
        })
        continue

    # Construct template
    current_idx = 0
    for m in matches:
        # Add text before match
        processed_template += en_raw[last_end:m.start()]
        
        # Add placeholder
        processed_template += f"__{current_idx}__"
        
        # Add content to blanks
        blanks.append(m.group(1))
        
        last_end = m.end()
        current_idx += 1
        
    # Add remaining text
    processed_template += en_raw[last_end:]
    
    sentences_clean.append({
        "id": f"reorder_finals_{i+1:03d}",
        "type": "reorder", # Using reorder renderer for fill-in-blanks
        "prompt": jp,
        "template": processed_template,
        "blanks": blanks,
        "category": "finals_range",
        "difficulty": "medium"
    })

# Write files
output_dir = 'data'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

with open(os.path.join(output_dir, 'questions_finals_verbs.json'), 'w', encoding='utf-8') as f:
    json.dump(verbs_clean, f, indent=2, ensure_ascii=False)

with open(os.path.join(output_dir, 'questions_finals_sentences.json'), 'w', encoding='utf-8') as f:
    json.dump(sentences_clean, f, indent=2, ensure_ascii=False)

print("Files generated successfully.")
