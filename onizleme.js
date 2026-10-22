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
["Kapı Açılışı", "Katılımcı Karşılama", "Etkinlik Başlangıcı", "Yarışma Aşamaları", "Final", "Kapanış"].forEach(function (title, index) {
	var item = document.createElement("li");
	item.className = "t";
	item.style.transitionDelay = (index % 3) * 0.1 + "s";
	item.innerHTML = "<b>0" + (index + 1) + "</b><h3>" + title + "</h3><p>Saat: Yakında Açıklanacak</p>";
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
	ad: "Adınızı girin",
	soyad: "Soyadınızı girin",
	kurum: "Kurum / üniversite girin",
	takim: "Takım adını girin"
};

var formDefinitions = {
	y: {
		t: "Yarışmaya katıl",
		s: "Takımınla sahaya çık. Başvurunu birkaç dakikada tamamla.",
		p: [
			"Başvurular organizasyon ekibince incelenir",
			"Onay ve program bilgisi e-postayla iletilir",
			"Başvuru sonunda referans numarası verilir"
		],
		g: [
			["Kişisel bilgiler", [
				["ad", "Ad", "text", "given-name", 1],
				["soyad", "Soyad", "text", "family-name", 1],
				["email", "E-posta", "email", "email", 1, 1],
				["tel", "Telefon", "tel", "tel", 1, 1, "05XXXXXXXXX"]
			]],
			["Kurum ve takım", [
				["kurum", "Üniversite / kurum", "text", "organization", 1, 1],
				["bolum", "Bölüm (isteğe bağlı)", "text", "", 0],
				["takim", "Takım adı", "text", "", 1]
			]]
		]
	},
	t: {
		t: "Tribüne katıl",
		s: "Heyecana ortak ol. Kısa formu doldur, yerini ayırt.",
		p: [
			"Kontenjan dolunca başvurular durdurulabilir",
			"Yedek liste uygulanırsa e-postayla bildirilir",
			"Başvuru sonunda referans numarası verilir"
		],
		g: [
			["Kişisel bilgiler", [
				["ad", "Ad", "text", "given-name", 1],
				["soyad", "Soyad", "text", "family-name", 1],
				["email", "E-posta", "email", "email", 1, 1],
				["tel", "Telefon", "tel", "tel", 1, 1, "05XXXXXXXXX"]
			]],
			["Kurum", [
				["kurum", "Üniversite / kurum (isteğe bağlı)", "text", "organization", 0, 1]
			]]
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

	return required && value.length < 2 ? requiredFieldMessages[name] : "";
}

var fieldIcons = {
	user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
	mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
	phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
	building: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1M9 13h1M14 9h1M14 13h1M10 21v-4h4v4"/>',
	book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/>',
	users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>'
};

var fieldIconNames = {
	ad: "user",
	soyad: "user",
	email: "mail",
	tel: "phone",
	kurum: "building",
	bolum: "book",
	takim: "users"
};

// Basvuru pencerelerini olustur ve alan dogrulamasini bagla
function createApplicationDialog(kind) {
	var config = formDefinitions[kind];
	var dialog = document.createElement("dialog");
	dialog.className = "fd " + kind;
	dialog.id = "d-" + kind;
	dialog.setAttribute("aria-labelledby", "t-" + kind);

	var markup = '<div class="pg"><i></i></div><div class="fb"><button class="fx" type="button" aria-label="Kapat">✕</button><h2 id="t-' + kind + '">' + config.t + '</h2><p class="fsub">' + config.s + ' Zorunlu alanlar * ile işaretlidir.</p><form novalidate>';

	config.g.forEach(function (group) {
		markup += '<fieldset><legend>' + group[0] + '</legend>';

		group[1].forEach(function (field) {
			markup += '<div class="fl' + (field[5] ? " full" : "") + '"><label for="' + kind + field[0] + '">' + field[1] + (field[4] ? '<b class="rq" aria-hidden="true">*</b>' : "") + '</label><div class="iw"><svg viewBox="0 0 24 24" aria-hidden="true">' + fieldIcons[fieldIconNames[field[0]]] + '</svg><input id="' + kind + field[0] + '" name="' + field[0] + '" type="' + field[2] + '" autocomplete="' + (field[3] || "off") + '"' + (field[6] ? ' placeholder="' + field[6] + '"' : "") + (field[2] === "tel" ? ' inputmode="tel" maxlength="14"' : "") + (field[2] === "email" ? ' inputmode="email"' : "") + ' data-r="' + field[4] + '"></div><span class="em" role="alert"></span></div>';
		});

		markup += "</fieldset>";
	});

	markup += '<label class="kv"><input type="checkbox" name="kvkk"><span><a href="https://www.nisantasi.edu.tr/sayfa/kisisel-veriler-kvkk-921828" target="_blank" rel="noopener noreferrer" style="color:#0D6EB6;text-decoration:underline">KVKK Aydınlatma Metni</a>\'ni okudum ve onaylıyorum.</span></label><span class="em kvm" role="alert"></span><p class="st2" role="status"></p><button class="go" type="submit"><span class="sp2"></span><span>Başvuruyu gönder</span></button><p class="pv">Önizleme: bu sayfada başvuru kaydedilmez.</p><div class="success-panel" role="status" aria-live="polite" tabindex="-1" hidden><span class="success-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg></span><h3>Başvurunuz başarıyla tamamlandı!</h3><p>Bilgileriniz doğrulandı. Bu önizlemede gerçek kayıt oluşturulmadı.</p></div></form></div>';

	dialog.innerHTML = markup;
	document.body.appendChild(dialog);

	var form = dialog.querySelector("form");
	var inputs = form.querySelectorAll(".fl input");
	var progress = dialog.querySelector(".pg i");
	var successPanel = form.querySelector(".success-panel");
	function validateInput(input, showMessage) {
		var message = validateField(input.name, input.value, input.dataset.r === "1");
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
		var total = 1;
		var completed = form.kvkk.checked ? 1 : 0;

		inputs.forEach(function (input) {
			if (input.dataset.r === "1") {
				total++;
				if (!validateInput(input, false)) completed++;
			}
		});

		progress.style.width = completed / total * 100 + "%";
	}

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

	form.kvkk.addEventListener("change", function () {
		dialog.querySelector(".kvm").textContent = "";
		updateFormProgress();
	});

	form.onsubmit = function (event) {
		event.preventDefault();
		var firstInvalidInput = null;

		inputs.forEach(function (input) {
			if (validateInput(input, true) && !firstInvalidInput) {
				firstInvalidInput = input;
			}
		});

		var hasKvkkConsent = form.kvkk.checked;
		var status = dialog.querySelector(".st2");
		var submitButton = dialog.querySelector(".go");
		dialog.querySelector(".kvm").textContent = hasKvkkConsent ? "" : "KVKK aydınlatma metnini onaylamalısınız";
		status.textContent = "";

		if (firstInvalidInput) {
			firstInvalidInput.focus();
			return;
		}
		if (!hasKvkkConsent) return;

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
var universityLogo = document.querySelector(".logo img").src;
var nbaLogo = document.querySelector(".nbal").src;

document.querySelectorAll("[data-lg]").forEach(function (image) {
	image.src = image.dataset.lg === "nu" ? universityLogo : nbaLogo;
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
createApplicationDialog("t");

document.querySelectorAll("[data-open]").forEach(function (trigger) {
	trigger.onclick = function (event) {
		event.preventDefault();
		$("#m").classList.remove("o");
		$("#cm").classList.remove("o");
		$("#ch").setAttribute("aria-expanded", "false");

		var dialog = $("#d-" + trigger.dataset.open);
		dialog.showModal();
		dialog.querySelector("input").focus();
	};
});

var applicationButton = $("#ch");
var applicationMenu = $("#cm");

applicationButton.onclick = function (event) {
	event.stopPropagation();
	var isOpen = applicationMenu.classList.toggle("o");
	applicationButton.setAttribute("aria-expanded", isOpen);
};

document.addEventListener("click", function (event) {
	if (!applicationMenu.contains(event.target)) {
		applicationMenu.classList.remove("o");
		applicationButton.setAttribute("aria-expanded", "false");
	}
});

document.addEventListener("keydown", function (event) {
	if (event.key === "Escape") {
		applicationMenu.classList.remove("o");
		applicationButton.setAttribute("aria-expanded", "false");
	}
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
