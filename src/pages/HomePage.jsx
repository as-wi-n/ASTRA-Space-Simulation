import { useState } from "react";
import { ArrowRight, Orbit, Rocket, Satellite, Wind, Sun, Droplets, Apple, Zap, Shield, ChevronDown } from "lucide-react";
import "./HomePage.css";

export default function HomePage({ onStartMission }) {
  const [destination, setDestination] = useState("Moon");
  const [difficulty, setDifficulty] = useState("survival");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [launching, setLaunching] = useState(false);

  function enterMission(e) {
    e.preventDefault();
    const astronautName = name.trim();
    if (!astronautName) { setError("Enter your astronaut name to continue."); return; }
    setError("");
    setLaunching(true);
    window.setTimeout(
      () => onStartMission({ astronautName, destination, difficulty, mission: destination === "Moon" ? "Lunar Outpost: First Light" : "Red Frontier: Beyond Earth" }),
      900,
    );
  }

  if (launching) {
    return (
      <main className={`simple-launch-screen destination-${destination.toLowerCase()}`}>
        <div className="simple-stars" />
        <div className="simple-launch-content">
          <div className="launch-icon"><Rocket size={38} /></div>
          <p className="simple-kicker">ASTRA SPACE PROGRAM</p>
          <h1>Preparing your mission</h1>
          <p>{name.trim()} · {destination === "Moon" ? "Lunar surface" : "Mars"}</p>
          <div className="simple-loading"><span /></div>
        </div>
      </main>
    );
  }

  return (
    <main className={`astra-home destination-${destination.toLowerCase()}`}>
      <header className="astra-nav">
        <div className="astra-nav-brand"><Orbit size={17} /> ASTRA</div>
        <nav aria-label="Main navigation">
          <a className="current" href="#home">HOME</a>
          <a href="#about">ABOUT</a>
          <a href="#colonies">COLONIES</a>
          <a href="#planets">PLANETS</a>
        </nav>
        <span className="astra-nav-status"><i /> MISSION SYSTEM ONLINE</span>
      </header>

      <section className="astra-hero" id="home">
        <div className="astra-stars" aria-hidden="true" /><div className="astra-frame" aria-hidden="true" />
        <div className="astra-planet" aria-hidden="true" /><div className="astra-orbit" aria-hidden="true" /><div className="astra-satellite" aria-hidden="true"><Satellite size={22} /></div>
        <section className="astra-main">
          <p className="astra-overline">YOUR JOURNEY BEYOND EARTH BEGINS HERE</p><h1>ASTRA</h1><p className="astra-subtitle">ASTRONAUT SIMULATION &amp; SPACE EXPLORATION</p>
          <div className="astra-destination-label" id="planets-label">SELECT YOUR DESTINATION</div>
          <div className="astra-destination-switch" role="group" aria-label="Choose destination">
            <button type="button" onClick={() => setDestination("Moon")} className={destination === "Moon" ? "selected" : ""} aria-pressed={destination === "Moon"}><span className="mini-planet mini-moon" /><span><strong>LUNAR</strong><small>THE MOON</small></span>{destination === "Moon" && <b>SELECTED</b>}</button>
            <button type="button" onClick={() => setDestination("Mars")} className={destination === "Mars" ? "selected" : ""} aria-pressed={destination === "Mars"}><span className="mini-planet mini-mars" /><span><strong>MARS</strong><small>THE RED PLANET</small></span>{destination === "Mars" && <b>SELECTED</b>}</button>
          </div>
          <div className="astra-difficulty-label">MISSION DIFFICULTY</div>
          <div className="astra-difficulty-switch" role="group" aria-label="Choose difficulty">
            {[
              { id: "explorer", label: "EXPLORER", note: "Forgiving supplies" },
              { id: "survival", label: "SURVIVAL", note: "Balanced challenge" },
              { id: "commander", label: "COMMANDER", note: "Limited & brutal" },
              { id: "kid", label: "KID MODE", note: "10–12 Sols · big gauges" },
            ].map((d) => (
              <button key={d.id} type="button" onClick={() => setDifficulty(d.id)} className={difficulty === d.id ? "selected" : ""} aria-pressed={difficulty === d.id}>
                <strong>{d.label}</strong>
                <small>{d.note}</small>
              </button>
            ))}
          </div>
          <form className="astra-entry" onSubmit={enterMission}>
            <label htmlFor="astronaut-name">ASTRONAUT NAME</label>
            <div className="astra-input-wrap">
              <input id="astronaut-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={24} placeholder="Enter your callsign" autoComplete="off" />
              <span>✦</span>
            </div>
            {error && <p className="astra-error" role="alert">{error}</p>}
            <button className="astra-enter" type="submit">ENTER MISSION <ArrowRight size={17} /></button>
          </form>
        </section>
        <aside className="astra-side-info astra-left-info"><span className="side-info-title">DESTINATION</span><strong>{destination === "Moon" ? "LUNA" : "MARS"}</strong><small>{destination === "Moon" ? "384,400 KM FROM EARTH" : "225M KM AVG. FROM EARTH"}</small><div className="side-divider" /><span className="side-info-title">MISSION TYPE</span><strong>EXPLORATION</strong></aside>
        <aside className="astra-side-info astra-right-info"><span className="side-info-title">MISSION STATUS</span><strong className="status-ready">READY</strong><small>AWAITING ASTRONAUT</small><div className="side-divider" /><span className="side-info-title">PROGRAM</span><strong>ASTRA-01</strong></aside>
        <footer className="astra-footer"><span>ASTRA SPACE EXPLORATION PROGRAM</span><span>CHOOSE · PREPARE · EXPLORE</span><span>V 1.0.0</span></footer>
        <a href="#about" className="astra-scroll-hint" aria-label="Scroll to About ASTRA"><ChevronDown size={22} /></a>
      </section>

      <section id="about" className="astra-section astra-section-about">
        <div className="astra-section-inner">
          <p className="astra-section-kicker">ABOUT ASTRA</p>
          <h2 className="astra-section-title">A junior astronaut mission trainer</h2>
          <p className="astra-section-lead">ASTRA is an interactive simulation inspired by the NASA Space Apps Challenge 2026 challenge, <em>“Build a Junior Astronaut Mission Trainer.”</em> You are not just clicking buttons — you are commanding a real outpost where oxygen, water, food, power, temperature, and radiation all compete for your attention.</p>

          <div className="astra-about-grid">
            <div className="astra-info-card">
              <div className="astra-info-icon"><Rocket size={22} aria-hidden="true" /></div>
              <h3>Choose · Prepare · Explore</h3>
              <p>Pick a destination, enter your callsign, and launch. Every decision changes the simulation: systems use power, crews use supplies, and the environment fights back.</p>
            </div>
            <div className="astra-info-card">
              <div className="astra-info-icon"><Shield size={22} aria-hidden="true" /></div>
              <h3>Real science, simple choices</h3>
              <p>ASTRA uses simplified NASA reference material to teach life support, radiation protection, solar power, dust storms, and thermal control in a way junior astronauts can understand.</p>
            </div>
            <div className="astra-info-card">
              <div className="astra-info-icon"><Apple size={22} aria-hidden="true" /></div>
              <h3>Survival is the mission</h3>
              <p>Keep your crew alive until the mission timer ends. Run out of oxygen, water, food, or all power and the mission fails. The final report shows what you did well — and what needs improvement.</p>
            </div>
          </div>

          <div className="astra-how-it-works">
            <h3 className="astra-subheading">HOW ASTRA WORKS</h3>
            <ol className="astra-steps">
              <li><span>1</span><div><strong>Launch</strong><p>Select Lunar or Mars, enter your astronaut name, and enter the outpost in command.</p></div></li>
              <li><span>2</span><div><strong>Manage each Sol</strong><p>Toggle systems like recyclers, greenhouse, heating, solar, and radiation shelter. Watch the resource cards and chart.</p></div></li>
              <li><span>3</span><div><strong>Respond to emergencies</strong><p>Leaks, dust storms, radiation storms, equipment failures, and heat waves each demand trade-offs. Choose what to protect.</p></div></li>
            </ol>
          </div>
        </div>
      </section>

      <section id="colonies" className="astra-section astra-section-colonies">
        <div className="astra-section-inner">
          <p className="astra-section-kicker">COLONIES &amp; OUTPOSTS</p>
          <h2 className="astra-section-title">Two future home bases beyond Earth</h2>
          <p className="astra-section-lead">A space colony is not just a building — it is a closed loop of air, water, food, power, and protection. ASTRA simulates two very different outposts, so the same strategy will not survive both.</p>

          <div className="astra-colony-grid">
            <article className="astra-colony-card destination-moon">
              <div className="astra-colony-tag">LUNA</div>
              <h3>Lunar South Pole Outpost</h3>
              <p className="astra-colony-sub">“First Light” mission · edge of permanently shadowed craters</p>
              <ul>
                <li><strong>Air:</strong> Almost no atmosphere. Oxygen must be recycled and conserved at all times.</li>
                <li><strong>Power:</strong> Solar panels work near peaks of eternal light; long shadows reduce generation.</li>
                <li><strong>Temperature:</strong> Swings of more than 250°C between day and night demand active heating.</li>
                <li><strong>Radiation:</strong> No thick atmosphere or magnetosphere. Shielded storm vault required during solar events.</li>
              </ul>
              <p className="astra-colony-foot">Ideal for learning radiation discipline and careful power budgeting.</p>
            </article>

            <article className="astra-colony-card destination-mars">
              <div className="astra-colony-tag">ARES</div>
              <h3>Ares Planitia Outpost</h3>
              <p className="astra-colony-sub">“Beyond Earth” mission · dusty plains of the Red Planet</p>
              <ul>
                <li><strong>Air:</strong> Very thin carbon dioxide atmosphere. Habitat pressure and oxygen remain critical.</li>
                <li><strong>Power:</strong> Frequent dust storms can scatter sunlight and coat panels, cutting output hard.</li>
                <li><strong>Temperature:</strong> Average around −60°C with strong swings. Heating uses serious energy.</li>
                <li><strong>Radiation:</strong> Mars has a thin shield. Storm sheltering and limited EVA are essential.</li>
                <li><strong>Dust:</strong> Fine, electrostatic dust fouls panels, seals, and moving parts. Maintenance matters.</li>
              </ul>
              <p className="astra-colony-foot">Ideal for learning equipment care, dust-storm response, and long-horizon survival.</p>
            </article>
          </div>

          <div className="astra-colony-strip">
            <div><p className="astra-strip-title">WHAT EVERY OUTPOST NEEDS</p>
              <div className="astra-need-grid">
                <span><Wind size={16} aria-hidden="true" /> Oxygen recycler</span>
                <span><Droplets size={16} aria-hidden="true" /> Water recovery</span>
                <span><Apple size={16} aria-hidden="true" /> Food production</span>
                <span><Sun size={16} aria-hidden="true" /> Solar + batteries</span>
                <span><Zap size={16} aria-hidden="true" /> Power management</span>
                <span><Shield size={16} aria-hidden="true" /> Radiation shelter</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="planets" className="astra-section astra-section-planets">
        <div className="astra-section-inner">
          <p className="astra-section-kicker">PLANETS</p>
          <h2 className="astra-section-title">Know your world before you travel</h2>
          <p className="astra-section-lead">Both destinations are close enough to visit but far enough that every mistake costs real supplies. Use this table to understand the differences before launch.</p>

          <div className="astra-fact-table" role="table" aria-label="Comparison of the Moon and Mars">
            <div role="row" className="astra-fact-row astra-fact-head"><div role="columnheader">Feature</div><div role="columnheader">The Moon</div><div role="columnheader">Mars</div></div>
            <div role="row" className="astra-fact-row"><div role="cell" data-label="Feature">Distance from Earth</div><div role="cell" data-label="The Moon">384,400 km (~1.25 light-seconds)</div><div role="cell" data-label="Mars">225.4 million km avg (~12.5 light-minutes)</div></div>
            <div role="row" className="astra-fact-row"><div role="cell" data-label="Feature">Gravity</div><div role="cell" data-label="The Moon">1.62 m/s² (about 1/6 Earth)</div><div role="cell" data-label="Mars">3.71 m/s² (about 1/3 Earth)</div></div>
            <div role="row" className="astra-fact-row"><div role="cell" data-label="Feature">Atmosphere</div><div role="cell" data-label="The Moon">Effectively none; no weather, no air</div><div role="cell" data-label="Mars">Very thin CO₂ (&lt;1% of Earth pressure)</div></div>
            <div role="row" className="astra-fact-row"><div role="cell" data-label="Feature">Day length</div><div role="cell" data-label="The Moon">29.5 Earth days</div><div role="cell" data-label="Mars">24h 37m — close to an Earth day</div></div>
            <div role="row" className="astra-fact-row"><div role="cell" data-label="Feature">Avg. temperature</div><div role="cell" data-label="The Moon">≈ −20°C; swings from −173°C to +127°C</div><div role="cell" data-label="Mars">≈ −60°C; swings from −110°C to +20°C</div></div>
            <div role="row" className="astra-fact-row"><div role="cell" data-label="Feature">Radiation</div><div role="cell" data-label="The Moon">High; no atmospheric protection</div><div role="cell" data-label="Mars">Moderate; thin atmosphere plus weak magnetosphere</div></div>
            <div role="row" className="astra-fact-row"><div role="cell" data-label="Feature">Solar power</div><div role="cell" data-label="The Moon">Strong near poles; long shadow periods</div><div role="cell" data-label="Mars">Weaker; dust storms can block sunlight for weeks</div></div>
            <div role="row" className="astra-fact-row"><div role="cell" data-label="Feature">Mission difficulty</div><div role="cell" data-label="The Moon">Moderate — shorter survival window, big thermal swings</div><div role="cell" data-label="Mars">Hard — longer duration, dust, lower solar, harsher cold</div></div>
          </div>

          <div className="astra-planet-cards">
            <article className="astra-planet-card mini-moon-card">
              <p className="astra-planet-name">THE MOON</p>
              <h3>Earth’s nearest neighbor</h3>
              <p>Close enough to test life-support and settlement tech before sending humans to Mars. Silent, airless, and unforgiving, Luna is the perfect proving ground.</p>
            </article>
            <article className="astra-planet-card mini-mars-card">
              <p className="astra-planet-name">MARS</p>
              <h3>The next frontier</h3>
              <p>Mars is far colder, drier, and dustier. Surviving here means mastering dust storms, power storage, radiation sheltering, and recycling everything you bring.</p>
            </article>
          </div>
        </div>
      </section>

      <footer className="astra-landing-footer">
        <span>ASTRA SPACE EXPLORATION PROGRAM</span>
        <span>A NASA Space Apps Challenge 2026 Junior Astronaut Mission Trainer</span>
        <span><a href="#home">BACK TO TOP ↑</a></span>
      </footer>
    </main>
  );
}
