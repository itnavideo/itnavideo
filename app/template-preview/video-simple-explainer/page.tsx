export default function VideoSimpleExplainerPreviewPage() {
  return (
    <main className="fixed inset-0 z-[9999] overflow-auto bg-black text-white">
      <section className="mx-auto flex min-h-screen w-full items-start justify-center bg-black py-8">
        <div className="relative aspect-[9/16] w-[540px] overflow-hidden bg-black shadow-[0_0_80px_rgba(0,0,0,0.9)]">
          
          {/* TOP VIDEO */}
          <div className="relative mx-[14px] mt-[34px] aspect-video overflow-hidden border-[3px] border-white bg-zinc-950">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#313845_0%,#101827_42%,#030712_100%)]" />
            <div className="absolute right-0 top-0 h-full w-[34%] bg-[radial-gradient(circle_at_40%_45%,rgba(255,255,255,0.35),transparent_12%),linear-gradient(90deg,rgba(255,255,255,0.08),rgba(0,0,0,0.65))]" />
            
            {/* fake creator */}
            <div className="absolute bottom-0 left-[56px] h-[230px] w-[150px] rounded-t-[80px] bg-gradient-to-b from-[#f2d5bd] via-[#111827] to-black shadow-2xl" />
            <div className="absolute bottom-[145px] left-[92px] h-[78px] w-[78px] rounded-full bg-gradient-to-b from-[#f3d1b5] to-[#c28e72]" />
            <div className="absolute bottom-[110px] left-[42px] h-[52px] w-[42px] rotate-[-26deg] rounded-full bg-[#f2d5bd]" />
            <div className="absolute bottom-[112px] left-[206px] h-[52px] w-[42px] rotate-[26deg] rounded-full bg-[#f2d5bd]" />

            {/* camera blur */}
            <div className="absolute right-[90px] top-[92px] h-[70px] w-[120px] rounded-xl bg-white/18 blur-[2px]" />
            <div className="absolute right-[35px] top-[65px] h-[120px] w-[58px] rounded-xl bg-white/20 blur-[2px]" />
          </div>

          {/* GAP */}
          <div className="h-[32px]" />

          {/* SUBTITLE STRIP */}
          <div className="relative h-[80px] border-y-[3px] border-[#fff24a] bg-gradient-to-r from-[#5867ff] via-[#9d62ff] to-[#ff60bd]">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.16),transparent_38%,rgba(255,255,255,0.12))]" />
            <div className="flex h-full items-center justify-center px-8 text-center">
              <p className="text-[39px] font-black uppercase leading-none tracking-[0.04em] text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.26)]">
                SUBTITLES APPLY HERE...
              </p>
            </div>
          </div>

          {/* TITLE STRIP */}
          <div className="flex h-[86px] items-center justify-center bg-black px-10 text-center">
            <h1 className="text-[39px] font-black uppercase leading-none tracking-[0.07em] text-white drop-shadow-[0_4px_0_rgba(255,255,255,0.08)]">
              VIDEO TITLE HERE
            </h1>
          </div>

          {/* BOTTOM IMAGE */}
          <div className="relative h-[584px] overflow-hidden bg-[#b49f82]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#d8c1a0_0%,#f3ead9_36%,#a78358_100%)]" />
            <div className="absolute left-[-60px] top-[70px] h-[230px] w-[520px] rotate-[-8deg] rounded-[50%] bg-white/28 blur-2xl" />
            
            {/* notebook */}
            <div className="absolute left-[70px] top-[255px] h-[74px] w-[260px] rotate-[-4deg] rounded-[18px] bg-[#d7f4f3] shadow-xl" />
            <div className="absolute left-[40px] top-[278px] h-[34px] w-[350px] rotate-[-3deg] rounded-full bg-white/75 blur-sm" />

            {/* coin stacks */}
            <div className="absolute bottom-[72px] left-[12px] h-[42px] w-[54px] rounded-t-md bg-gradient-to-b from-[#e0b15c] to-[#896224]" />
            <div className="absolute bottom-[72px] left-[86px] h-[78px] w-[62px] rounded-t-md bg-gradient-to-b from-[#e8bd66] to-[#8b6429]" />
            <div className="absolute bottom-[72px] left-[175px] h-[118px] w-[70px] rounded-t-md bg-gradient-to-b from-[#e5c487] to-[#8c6b3b]" />
            <div className="absolute bottom-[72px] left-[275px] h-[150px] w-[80px] rounded-t-md bg-gradient-to-b from-[#f2d69d] to-[#8e7044]" />

            {/* hand/palm */}
            <div className="absolute bottom-[145px] right-[-15px] h-[116px] w-[240px] rotate-[6deg] rounded-[60px] bg-gradient-to-b from-[#f2c9a8] to-[#c98764] shadow-2xl" />
            <div className="absolute bottom-[220px] right-[105px] h-[46px] w-[42px] rounded-full bg-[#f5d1b5]" />
            <div className="absolute bottom-[224px] right-[62px] h-[50px] w-[42px] rounded-full bg-[#f5d1b5]" />
            <div className="absolute bottom-[220px] right-[20px] h-[46px] w-[42px] rounded-full bg-[#f5d1b5]" />

            {/* tree */}
            <div className="absolute bottom-[218px] right-[126px] h-[150px] w-[12px] bg-gradient-to-b from-[#7a4b1f] to-[#3f2411]" />
            <div className="absolute bottom-[350px] right-[55px] h-[118px] w-[170px] rounded-[50%] bg-[radial-gradient(circle,#6ed43b_0%,#2f9a25_42%,#15651e_100%)] shadow-[0_16px_35px_rgba(0,0,0,0.35)]" />
            <div className="absolute bottom-[405px] right-[95px] h-[76px] w-[118px] rounded-[50%] bg-[radial-gradient(circle,#91ee55_0%,#359b28_48%,#1e6b1f_100%)]" />
            <div className="absolute bottom-[382px] right-[160px] h-[76px] w-[110px] rounded-[50%] bg-[radial-gradient(circle,#82e64c_0%,#318d29_50%,#145b1d_100%)]" />

            {/* warm overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,rgba(255,212,80,0.38),transparent_28%),linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.04)_100%)]" />
          </div>
        </div>
      </section>
    </main>
  );
}
