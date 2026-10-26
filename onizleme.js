// DOM secicileri ve ana menu
var $ = function (selector) {
	return document.querySelector(selector);
};
var header = $("#h");

addEventListener("scroll", function () {
	header.classList.toggle("s", scrollY > 40);
}, { passive: true });

$("#mb").onclick = function () {
	var isOpen = $("#m").classList.toggle("o");
	this.setAttribute("aria-expanded", isOpen);
};

document.querySelectorAll("#m a").forEach(function (link) {
	link.onclick = function () {
		$("#m").classList.remove("o");
	};
});

// Program zaman cizelgesini olustur
[["11:00", "Açılış Töreni", "Sunucu, geçit töreni, konuk tanıtımı ve protokol konuşmaları."], ["11:30–14:30", "Grup Maçları", "24 maç, 12 dilim. Skor takibi, sağlık ve güvenlik organizasyonu, sosyal medya akışı."], ["14:30–15:30", "Son 16 ve Ara Şov", "8 maç, basketbol etkinlikleri, şut challenge ve sponsor etkinlikleri."], ["15:30–16:15", "Çeyrek ve Yarı Finaller", "6 maç, canlı yayın ve sosyal medyada anlık paylaşımlar."], ["16:15", "3.'lük Maçı ve Final", "Final öncesi söyleşi ve ödül sahnesinin hazırlığı."], ["16:30–17:00", "Ödül Töreni ve Kapanış", "Kupa, madalya, MVP ve bireysel ödüller, çekiliş, imza ve fotoğraf çekimleri, teşekkürler."]].forEach(function (entry, index) {
	var title = entry[1];
	var item = document.createElement("li");
	item.className = "t";
	item.style.transitionDelay = (index % 3) * 0.1 + "s";
	item.innerHTML = "<b>" + entry[0] + "</b><h3>" + title + "</h3><p>" + entry[2] + "</p>";
	$("#tl").appendChild(item);
});

// Gorunur bolumleri ve giris animasyonlarini izle
var io = new IntersectionObserver(function (entries) {
	entries.forEach(function (entry) {
		if (entry.isIntersecting) {
			entry.target.classList.add("v");
			io.unobserve(entry.target);
		}
	});
}, { threshold: 0.2 });

document.querySelectorAll("li.t").forEach(function (item) {
	io.observe(item);
});

// Hero, baslik ve kaydirma animasyonlari
var reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
var hero = $(".hero");
var heroContent = hero.querySelector(".in");
var progressBar = $("#pb");
var ball = $("#ball");
var ballShape = $("#bs");
var finalHeading = $(".fin h2");
var courtLines = document.querySelectorAll(".cl *");
var aboutSection = $("#hakkinda");

document.querySelectorAll("main h2").forEach(function (heading) {
	var words = [];
	var wordIndex = 0;

	heading.childNodes.forEach(function (child) {
		if (child.nodeType === 3) {
			child.textContent.split(/\s+/).filter(Boolean).forEach(function (word) {
				words.push('<span class="w"><i style="--i:' + wordIndex++ + '">' + word + "</i></span> ");
			});
		} else if (child.nodeName === "BR") {
			words.push("<br>");
		}
	});

	heading.setAttribute("aria-label", heading.textContent.trim());
	heading.innerHTML = words.join("");
	heading.classList.add("sp");
	io.observe(heading);
});

document.querySelectorAll(".two a").forEach(function (link) {
	io.observe(link);
});

function updateScrollAnimations() {
	var scrollPosition = scrollY;
	var viewportHeight = innerHeight;
	var viewportWidth = innerWidth;

	progressBar.style.transform = "scaleX(" + scrollPosition / Math.max(1, document.documentElement.scrollHeight - viewportHeight) + ")";

	if (reduceMotion) {
		return;
	}

	hero.style.setProperty("--py", Math.min(scrollPosition, viewportHeight) * 0.25 + "px");
	heroContent.style.transform = "translate3d(0," + (-Math.min(scrollPosition, viewportHeight) * 0.12) + "px,0)";
	heroContent.style.opacity = Math.max(0, 1 - scrollPosition / (viewportHeight * 0.9));

	if (viewportWidth >= 760) {
		var progress = Math.min(1, scrollPosition / (viewportHeight * 2.2));
		var x = viewportWidth * 0.78 - progress * viewportWidth * 0.7;
		var floatHeight = viewportHeight * (0.3 + 0.55 * progress);
		var bounce = viewportHeight * 0.28 * Math.abs(Math.sin(progress * Math.PI * 3)) * (1 - 0.4 * progress);

		ball.style.transform = "translate3d(" + x + "px," + (floatHeight - bounce) + "px,0)";
		ballShape.setAttribute("transform", "rotate(" + scrollPosition * 0.4 + " 100 100)");
		ball.style.opacity = progress > 0.9 ? Math.max(0, (1 - progress) * 10) : 1;
	}

	var finalHeadingBounds = finalHeading.getBoundingClientRect();
	var headingProgress = Math.min(1, Math.max(0, (viewportHeight - finalHeadingBounds.top) / (viewportHeight * 0.7)));
	finalHeading.style.transform = "scale(" + (0.78 + 0.22 * headingProgress) + ")";

	var aboutBounds = aboutSection.getBoundingClientRect();
	var courtProgress = Math.min(1, Math.max(0, (viewportHeight - aboutBounds.top) / (viewportHeight + aboutBounds.height)));
	courtLines.forEach(function (line) {
		line.style.strokeDashoffset = 1600 * (1 - courtProgress);
	});
}

var scrollFramePending = false;
addEventListener("scroll", function () {
	if (!scrollFramePending) {
		scrollFramePending = true;
		requestAnimationFrame(function () {
			scrollFramePending = false;
			updateScrollAnimations();
		});
	}
}, { passive: true });

addEventListener("resize", updateScrollAnimations);
updateScrollAnimations();

// Hareketli yazi seridi
var marquee = $("#mqt");
var marqueeText = "BASKETBOL ✦ SAHA ✦ TRİBÜN ✦ REKABET ✦ ";
marquee.innerHTML = ("<span>" + marqueeText + "</span>").repeat(8);

var marqueeOffset = 0;
var previousScrollPosition = scrollY;

if (!reduceMotion) {
	(function animateMarquee() {
		var scrollDelta = scrollY - previousScrollPosition;
		previousScrollPosition = scrollY;
		marqueeOffset -= 0.8 + scrollDelta * 0.6;

		var halfWidth = marquee.scrollWidth / 2;
		if (marqueeOffset < -halfWidth) marqueeOffset += halfWidth;
		if (marqueeOffset > 0) marqueeOffset -= halfWidth;

		marquee.style.transform = "translate3d(" + marqueeOffset + "px,0,0)";
		requestAnimationFrame(animateMarquee);
	})();
}

if (matchMedia("(hover:hover)").matches && !reduceMotion) {
	document.querySelectorAll(".btn").forEach(function (button) {
		button.addEventListener("pointermove", function (event) {
			var bounds = button.getBoundingClientRect();
			var offsetX = (event.clientX - bounds.left - bounds.width / 2) * 0.18;
			var offsetY = (event.clientY - bounds.top - bounds.height / 2) * 0.3;
			button.style.transform = "translate(" + offsetX + "px," + offsetY + "px)";
		});

		button.addEventListener("pointerleave", function () {
			button.style.transform = "";
		});
	});
}

// Basvuru formu icerigi ve alan ikonlari
var requiredFieldMessages = {
	team_name: "Takım veya okul adını girin",
	contact_name: "Başvuru sorumlusunun adını girin",
	email: "E-posta adresini girin",
	tel: "Telefon numarasını girin",
	athlete_name: "Sporcu adı soyadı girin",
	tc_kimlik: "T.C. kimlik numarasını girin",
	height: "Sporcu boyunu girin",
	weight: "Sporcu kilosunu girin",
	jersey_size: "Forma bedenini seçin",
	jersey_number: "Maç forma numarasını girin"
};

var formDefinitions = {
	y: {
		t: "Takım / okul başvurusu",
		s: "Takım bilgilerini ve beş sporcunun bilgilerini doldurun.",
		g: [
			["Takım ve sorumlu kişi", [
				["team_name", "Takım / okul adı", "text", "organization", 1, 1],
				["contact_name", "Başvuru sorumlusu adı soyadı", "text", "name", 1, 1],
				["email", "E-posta", "email", "email", 1, 1],
				["tel", "Telefon", "tel", "tel", 1, 1, "05XXXXXXXXX"]
			]]
		],
		athletes: [
			["athlete_name", "Sporcu Adı Soyadı", "text", "name", 1, 1],
			["tc_kimlik", "T.C. Kimlik Numarası", "text", "off", 1, 1, "11 haneli numara"],
			["height", "Boy (cm)", "number", "off", 1, 0, "", 100, 240],
			["weight", "Kilo (kg)", "number", "off", 1, 0, "", 25, 250],
			["jersey_size", "Forma bedeni", "text", "off", 1],
			["jersey_number", "Maç forma numarası", "number", "off", 1, 0, "", 0, 99]
		]
	}
};

function validateField(name, value, required) {
	value = value.trim();

	if (name === "email") {
		return /^\S+@\S+\.\S+$/.test(value) ? "" : "Geçerli bir e-posta girin";
	}

	if (name === "tel") {
		return /^(\+90|0)?5\d{9}$/.test(value.replace(/\s/g, ""))
			? ""
			: "Telefon 05XXXXXXXXX biçiminde olmalı";
	}

	if (name === "tc_kimlik") {
		return /^\d{11}$/.test(value) ? "" : "T.C. kimlik numarası 11 haneli olmalı";
	}

	if (name === "height" || name === "weight" || name === "jersey_number") {
		var number = Number(value);
		var min = name === "jersey_number" ? 0 : 1;
		var max = name === "height" ? 240 : name === "weight" ? 250 : 99;
		return Number.isInteger(number) && number >= min && number <= max
			? ""
			: name === "jersey_number" ? "Forma numarası 0 ile 99 arasında olmalı" : "Geçerli bir sayı girin";
	}

	if (!required) return "";
	if (!value) return requiredFieldMessages[name] || "Bu alan zorunludur";
	if ((name === "team_name" || name === "contact_name" || name === "athlete_name") && value.length < 2) {
		return requiredFieldMessages[name] || "En az 2 karakter girin";
	}
	return "";
}

var fieldIcons = {
	user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
	mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
	phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
	building: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1M9 13h1M14 9h1M14 13h1M10 21v-4h4v4"/>',
	book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/>',
	users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
	idCard: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 10h4M14 14h4"/>',
	ruler: '<path d="m21.3 8.7-12.6 12.6a2 2 0 0 1-2.8 0l-2.2-2.2a2 2 0 0 1 0-2.8L16.3 3.7a2 2 0 0 1 2.8 0l2.2 2.2a2 2 0 0 1 0 2.8Z"/><path d="m7.5 14.5 2 2M10.5 11.5l2 2M13.5 8.5l2 2"/>',
	weight: '<path d="M12 3v18M5 7h14M5 7l-3 6h6L5 7ZM19 7l-3 6h6l-3-6Z"/>',
	shirt: '<path d="m16 3-4 2-4-2-5 3 2 5 3-1v12h8V10l3 1 2-5-5-3Z"/>',
	hash: '<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>'
};

var fieldIconNames = {
	team_name: "building",
	contact_name: "user",
	email: "mail",
	tel: "phone",
	athlete_name: "user",
	tc_kimlik: "idCard",
	height: "ruler",
	weight: "weight",
	jersey_size: "shirt",
	jersey_number: "hash"
};

// Basvuru pencerelerini olustur ve alan dogrulamasini bagla
function createApplicationDialog(kind) {
	var config = formDefinitions[kind];
	var dialog = document.createElement("dialog");
	dialog.className = "fd " + kind;
	dialog.id = "d-" + kind;
	dialog.setAttribute("aria-labelledby", "t-" + kind);

	var markup = '<div class="pg"><i></i></div><div class="fb"><button class="fx" type="button" aria-label="Kapat">✕</button><h2 id="t-' + kind + '">' + config.t + '</h2><p class="fsub">' + config.s + ' Zorunlu alanlar * ile işaretlidir.</p><form novalidate>';

	function renderField(field, prefix) {
		var fieldId = kind + (prefix ? "-" + prefix + "-" : "-") + field[0];
		var fieldName = prefix ? prefix + "_" + field[0] : field[0];
		var numericAttributes = field[2] === "number" ? ' inputmode="numeric" min="' + field[7] + '" max="' + field[8] + '" step="1"' : "";
		var identityAttributes = field[0] === "tc_kimlik" ? ' inputmode="numeric" maxlength="11" pattern="[0-9]{11}"' : "";

		return '<div class="fl' + (field[5] ? " full" : "") + '"><label for="' + fieldId + '">' + field[1] + (field[4] ? '<b class="rq" aria-hidden="true">*</b>' : "") + '</label><div class="iw"><svg viewBox="0 0 24 24" aria-hidden="true">' + fieldIcons[fieldIconNames[field[0]]] + '</svg><input id="' + fieldId + '" name="' + fieldName + '" data-field="' + field[0] + '" type="' + field[2] + '" autocomplete="' + (field[3] || "off") + '"' + (field[6] ? ' placeholder="' + field[6] + '"' : "") + (field[2] === "tel" ? ' inputmode="tel" maxlength="14"' : "") + (field[2] === "email" ? ' inputmode="email"' : "") + numericAttributes + identityAttributes + ' data-r="' + field[4] + '"></div><span class="em" role="alert"></span></div>';
	}

	config.g.forEach(function (group) {
		markup += '<fieldset><legend>' + group[0] + '</legend>';
		group[1].forEach(function (field) {
			markup += renderField(field, "");
		});
		markup += "</fieldset>";
	});

	markup += '<div class="roster-fields" hidden><div class="roster-heading"><h3>5 sporcu bilgileri</h3><p>Her sporcu için bilgileri ayrı ayrı doldurun.</p></div>';
	for (var athleteIndex = 1; athleteIndex <= 5; athleteIndex++) {
		markup += '<fieldset class="athlete-fields"><legend>0' + athleteIndex + '. Sporcu</legend>';
		config.athletes.forEach(function (field) {
			markup += renderField(field, "athlete-" + athleteIndex);
		});
		markup += "</fieldset>";
	}
	markup += '</div><label class="kv"><input type="checkbox" name="kvkk"><span><a href="https://www.nisantasi.edu.tr/sayfa/kisisel-veriler-kvkk-921828" target="_blank" rel="noopener noreferrer">KVKK Aydınlatma Metni</a>&#39;ni okudum ve onaylıyorum.</span></label><span class="em kvm" role="alert"></span><label class="kv"><input type="checkbox" name="participation_consent"><span><a class="open-terms" href="#terms-dialog">Katılım ve sorumluluk beyanı</a>&#39;ni okudum ve kabul ediyorum.</span></label><span class="em waiver-error" role="alert"></span><p class="st2" role="status"></p><button class="go" type="submit"><span class="sp2"></span><span>Başvuruyu gönder</span></button><p class="pv">Önizleme: bu sayfa başvuru bilgilerini kaydetmez.</p><div class="success-panel" role="status" aria-live="polite" tabindex="-1" hidden><span class="success-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg></span><h3>Başvurunuz alındı!</h3><p>Bu önizlemede gerçek kayıt oluşturulmadı.</p></div></form></div>';

	dialog.innerHTML = markup;
	document.body.appendChild(dialog);

	var form = dialog.querySelector("form");
	var inputs = form.querySelectorAll(".fl input");
	var progress = dialog.querySelector(".pg i");
	var successPanel = form.querySelector(".success-panel");
	var rosterFields = form.querySelector(".roster-fields");
	var teamNameInput = form.elements.namedItem("team_name");
	var kvkkInput = form.elements.namedItem("kvkk");
	var participationConsentInput = form.elements.namedItem("participation_consent");
	var participationConsentLink = form.querySelector(".open-terms");
	var participationTermsAccepted = false;
	participationConsentLink.acceptTerms = function () {
		participationTermsAccepted = true;
		participationConsentInput.checked = true;
		participationConsentInput.dispatchEvent(new Event("change", { bubbles: true }));
	};

	function validateInput(input, showMessage) {
		var message = validateField(input.dataset.field, input.value, input.dataset.r === "1");
		var field = input.closest(".fl");

		if (showMessage) {
			field.classList.toggle("bad", !!message);
			field.classList.toggle("ok", !message && input.value.trim() !== "");
			field.querySelector(".em").textContent = message;
			input.setAttribute("aria-invalid", message ? "true" : "false");
		}

		return message;
	}

	function updateFormProgress() {
		var total = 2;
		var completed = Number(kvkkInput.checked) + Number(participationConsentInput.checked);

		inputs.forEach(function (input) {
			if (input.closest(".roster-fields") && rosterFields.hidden) return;
			if (input.dataset.r === "1") {
				total++;
				if (!validateInput(input, false)) completed++;
			}
		});

		progress.style.width = completed / total * 100 + "%";
	}

	teamNameInput.addEventListener("input", function () {
		rosterFields.hidden = !teamNameInput.value.trim();
		updateFormProgress();
	});

	inputs.forEach(function (input) {
		input.addEventListener("blur", function () {
			validateInput(input, true);
			updateFormProgress();
		});

		input.addEventListener("input", function () {
			if (input.name === "tel") {
				var digits = input.value.replace(/\D/g, "").slice(0, 11);
				input.value = digits.replace(/(\d{4})(\d{0,3})(\d{0,2})(\d{0,2})/, function (_, first, second, third, fourth) {
					return [first, second, third, fourth].filter(Boolean).join(" ");
				});
			}

			if (input.closest(".fl").classList.contains("bad")) {
				validateInput(input, true);
			}
			updateFormProgress();
		});
	});

	kvkkInput.addEventListener("change", function () {
		dialog.querySelector(".kvm").textContent = "";
		updateFormProgress();
	});
	participationConsentInput.addEventListener("change", function () {
		if (participationConsentInput.checked && !participationTermsAccepted) {
			participationConsentInput.checked = false;
			participationConsentLink.click();
			return;
		}
		dialog.querySelector(".waiver-error").textContent = "";
		updateFormProgress();
	});

	form.onsubmit = function (event) {
		event.preventDefault();
		var firstInvalidInput = null;

		inputs.forEach(function (input) {
			if (input.closest(".roster-fields") && rosterFields.hidden) return;
			if (validateInput(input, true) && !firstInvalidInput) {
				firstInvalidInput = input;
			}
		});

		var hasKvkkConsent = kvkkInput.checked;
		var hasParticipationConsent = participationConsentInput.checked;
		var status = dialog.querySelector(".st2");
		var submitButton = dialog.querySelector(".go");
		dialog.querySelector(".kvm").textContent = hasKvkkConsent ? "" : "KVKK aydınlatma metnini onaylamalısınız";
		dialog.querySelector(".waiver-error").textContent = hasParticipationConsent ? "" : "Katılım ve sorumluluk beyanını kabul etmelisiniz";
		status.textContent = "";

		if (firstInvalidInput) {
			firstInvalidInput.focus();
			return;
		}
		if (!hasKvkkConsent) {
			kvkkInput.focus();
			return;
		}
		if (!hasParticipationConsent || !participationTermsAccepted) {
			participationConsentInput.focus();
			return;
		}

		submitButton.classList.add("ld");
		submitButton.disabled = true;
		setTimeout(function () {
			submitButton.classList.remove("ld");
			submitButton.disabled = false;
			form.classList.add("is-success");
			dialog.classList.add("is-success");
			successPanel.hidden = false;
			successPanel.focus();
		}, 700);
	};

	dialog.querySelector(".fx").onclick = function () {
		dialog.close();
	};
	dialog.addEventListener("click", function (event) {
		if (event.target === dialog) dialog.close();
	});
}

// Alt bilgi logolari ve sosyal medya baglantilari
var nbaLogo = document.querySelector(".nbal").src;

document.querySelectorAll("[data-lg]").forEach(function (image) {
	if (!image.getAttribute("src")) image.src = nbaLogo;
});

var socialLinks = {
	instagram: "https://www.instagram.com/nisantasiedu/",
	x: "https://twitter.com/nisantasiedu",
	youtube: "",
	linkedin: "https://www.linkedin.com/school/nisantasiuniversity/",
	facebook: "https://www.facebook.com/nisantasiedu/"
};

var socialIcons = {
	instagram: ["Instagram", '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/>'],
	x: ["X", '<path d="M4 4l16 16M20 4L4 20"/>'],
	youtube: ["YouTube", '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z"/>'],
	linkedin: ["LinkedIn", '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 11v6M8 7.5v.01M12 17v-6M12 13a3 3 0 0 1 6 0v4"/>'],
	facebook: ["Facebook", '<path d="M17 3h-3a4 4 0 0 0-4 4v3H7v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>']
};

$("#soc").innerHTML = Object.keys(socialIcons)
	.filter(function (name) {
		return socialLinks[name];
	})
	.map(function (name) {
		var url = socialLinks[name];
		var icon = '<svg viewBox="0 0 24 24" aria-hidden="true">' + socialIcons[name][1] + "</svg>";

		return url
			? '<a class="so" href="' + url + '" target="_blank" rel="noopener noreferrer" aria-label="' + socialIcons[name][0] + '">' + icon + "</a>"
			: '<span class="so off" title="Hesap bağlantısı eklenecek" aria-label="' + socialIcons[name][0] + ' (bağlantı eklenecek)">' + icon + "</span>";
	})
	.join("");

// Basvuru pencerelerini ve ust menu dugmelerini bagla
createApplicationDialog("y");

var termsDialog = $("#terms-dialog");
var termsFrame = $("#terms-frame");
var termsAcceptButton = $("#terms-accept");
var termsTrigger = null;
var termsFrameReady = false;

function updateTermsScrollState() {
	try {
		var documentElement = termsFrame.contentDocument.documentElement;
		var scrollElement = termsFrame.contentDocument.scrollingElement || documentElement;
		termsAcceptButton.disabled = scrollElement.scrollTop + documentElement.clientHeight < documentElement.scrollHeight - 8;
	} catch (error) {
		termsAcceptButton.disabled = true;
	}
}

function openParticipationTerms(event) {
	event.preventDefault();
	termsTrigger = event.currentTarget;
	termsAcceptButton.disabled = true;
	termsDialog.showModal();

	if (termsFrameReady) {
		termsFrame.contentWindow.scrollTo(0, 0);
		requestAnimationFrame(updateTermsScrollState);
	}
}


function bindTermsFrame() {
	if (termsFrameReady) return;
	termsFrameReady = true;
	termsFrame.contentWindow.addEventListener("scroll", updateTermsScrollState, { passive: true });
	updateTermsScrollState();
}

termsFrame.addEventListener("load", bindTermsFrame);
if (termsFrame.contentDocument && termsFrame.contentDocument.readyState === "complete") bindTermsFrame();

document.querySelectorAll(".open-terms").forEach(function (link) {
	link.addEventListener("click", openParticipationTerms);
});

termsAcceptButton.onclick = function () {
	if (termsAcceptButton.disabled || !termsTrigger || !termsTrigger.acceptTerms) return;
	termsTrigger.acceptTerms();
	termsDialog.close();
	termsTrigger.focus();
};

$("#terms-close").onclick = function () {
	termsDialog.close();
};
termsDialog.addEventListener("click", function (event) {
	if (event.target === termsDialog) termsDialog.close();
});

document.querySelectorAll("[data-open]").forEach(function (trigger) {
	trigger.onclick = function (event) {
		event.preventDefault();
		$("#m").classList.remove("o");

		var dialog = $("#d-" + trigger.dataset.open);
		dialog.showModal();
		dialog.querySelector("input").focus();
	};
});

// Cerez tercihleri
var cookieNotice = $("#ck");

function saveCookiePreference(value) {
	try {
		localStorage.setItem("ck", value);
	} catch (error) {
		// Depolama kapaliysa bildirim yine kapatilabilir.
	}

	cookieNotice.classList.remove("show");
	setTimeout(function () {
		cookieNotice.hidden = true;
	}, 500);
}

var hasCookiePreference = false;
try {
	hasCookiePreference = !!localStorage.getItem("ck");
} catch (error) {
	// Depolama kapaliysa tercih bildirimi gosterilir.
}

if (!hasCookiePreference) {
	setTimeout(function () {
		cookieNotice.hidden = false;
		requestAnimationFrame(function () {
			cookieNotice.classList.add("show");
		});
	}, 1200);
}

$("#ck-a").onclick = function () {
	saveCookiePreference("all");
};
$("#ck-n").onclick = function () {
	saveCookiePreference("necessary");
};

// Acilis sirasinda hero topunu gecici olarak yukleme alaninda goster
var introLoader = $("#intro-loader");
var introStage = $("#intro-ball-stage");
var ballPlaceholder = document.createComment("scroll-ball-home");
var introStartedAt = performance.now();
var introDismissScheduled = false;

ball.parentNode.insertBefore(ballPlaceholder, ball);
introStage.appendChild(ball);
ball.style.transform = "";
document.documentElement.classList.add("is-loading");

function finishIntroLoader() {
	if (introDismissScheduled) return;
	introDismissScheduled = true;

	var minimumDuration = reduceMotion ? 0 : 1300;
	var remainingTime = Math.max(0, minimumDuration - (performance.now() - introStartedAt));

	setTimeout(function () {
		introLoader.classList.add("is-hidden");

		setTimeout(function () {
			ballPlaceholder.parentNode.insertBefore(ball, ballPlaceholder);
			ballPlaceholder.remove();
			introLoader.remove();
			document.documentElement.classList.remove("is-loading");
			updateScrollAnimations();
		}, reduceMotion ? 0 : 550);
	}, remainingTime);
}

if (document.readyState === "complete") {
	finishIntroLoader();
} else {
	window.addEventListener("load", finishIntroLoader, { once: true });
}

setTimeout(finishIntroLoader, 4000);

// Etkinlik hakkinda fotografi: giris ve hafif parallax
document.querySelectorAll(".about-photo").forEach(function (figure) {
	io.observe(figure);
});
var aboutPhoto = document.querySelector(".about-photo img");
addEventListener("scroll", function () {
	if (reduceMotion || !aboutPhoto) return;
	var rect = aboutPhoto.parentNode.getBoundingClientRect();
	var progress = (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight;
	aboutPhoto.style.transform = "translate3d(0," + (progress * -24) + "px,0) scale(1.06)";
}, { passive: true });
