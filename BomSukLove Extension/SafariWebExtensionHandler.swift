//
//  SafariWebExtensionHandler.swift
//  BomSukLove Extension
//
//  Created by Jinwoo Kim on 9/22/21.
//

import SafariServices
import os.log

final class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {
    func beginRequest(with context: NSExtensionContext) {
        context.completeRequest(returningItems: [], completionHandler: nil)
    }
}
